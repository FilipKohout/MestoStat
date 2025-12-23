import logging
import db.connection as db_conn
from data.finances.budget_categories import CATEGORY_MAPPING
from services import structure_service, table_service


def _parse_money(value) -> float:
    if not value:
        return 0.0
    try:
        return float(str(value).strip().replace(',', '.'))
    except ValueError:
        return 0.0

def _get_expenses_category(paragraph: str) -> str:
    p = str(paragraph).strip()
    best_match = "Ostatní (Nespecifikováno)"
    max_len = 0

    for prefixes, category in CATEGORY_MAPPING.items():
        for prefix in prefixes:
            if p.startswith(prefix):
                if len(prefix) > max_len:
                    best_match = category
                    max_len = len(prefix)
    return best_match

def _get_income_category(polozka: str) -> str:
    p = str(polozka).strip()
    if p.startswith(("11", "12")): return "Sdílené daně"
    if p.startswith(("133", "134")): return "Místní poplatky"
    if p == "1511": return "Daň z nemovitosti"
    if p.startswith("1"): return "Ostatní daňové příjmy"

    if p.startswith("213"): return "Příjmy z pronájmu"
    if p.startswith("2"): return "Příjmy z vlastní činnosti"

    if p.startswith("3"): return "Prodej majetku"

    if p.startswith("41"): return "Provozní dotace"
    if p.startswith("42"): return "Investiční dotace"

    return "Ostatní příjmy"

def read_budget_files(data: dict[str, list[dict]]):
    for sheet_name, rows_list in data.items():
        if not rows_list:
            continue

        # We're only interested in the first sheet, others may have a different structure and contain data we're not interested in
        if "FINM201" not in sheet_name:
            continue

        read_budget_data(rows_list)

def read_budget_data(rows: list[dict]):
    cursor = db_conn.connection.cursor()
    expenses_data = {}
    income_data = {}

    for entry in rows:
        ico = str(entry.get("ZC_ICO:ZC_ICO")).strip()[2:]
        date = str(entry.get("0FISCPER:0FISCPER")).strip()
        state = str(entry.get("ZCMMT_ITM:ZCMMT_ITM")).strip()
        paragraph = str(entry.get("0FUNC_AREA:0FUNC_AREA")).strip()
        actual = _parse_money(entry.get("ZU_ROZKZ:ZU_ROZKZ"))
        adjusted = _parse_money(entry.get("ZU_ROZPZM:ZU_ROZPZM"))

        date_recorded = date[:4] + "-" + date[5:7] + "-1"
        muni_id = structure_service.find_municipality_by_ico(ico)

        if not muni_id:
            logging.warning(f"Municipality with IČO {ico} not found, skipping budget entry")
            continue

        if state.startswith("5") or state.startswith("6"):
            expenses_category = _get_expenses_category(paragraph)
            expenses_key = (muni_id, date_recorded, expenses_category)

            if expenses_key not in expenses_data:
                expenses_data[expenses_key] = {"actual": 0.0, "adjusted": 0.0}

            expenses_data[expenses_key]["actual"] += actual
            expenses_data[expenses_key]["adjusted"] += adjusted
        elif state.startswith("1") or state.startswith("2") or state.startswith("3") or state.startswith("4"):
            income_category = _get_income_category(state)
            income_key = (muni_id, date_recorded, income_category)

            if income_key not in income_data:
                income_data[income_key] = {"actual": 0.0, "adjusted": 0.0}

            income_data[income_key]["actual"] += actual
            income_data[income_key]["adjusted"] += adjusted

    expenses_sql = """
        INSERT INTO budget_expenses_data
            (municipality_id, date_recorded, category_name, actual_spending, budget_adjusted)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (municipality_id, date_recorded, category_name) DO NOTHING; 
    """

    income_sql = """
        INSERT INTO budget_income_data
            (municipality_id, date_recorded, category_name, actual_income, budget_adjusted)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (municipality_id, date_recorded, category_name) DO NOTHING;
    """

    for (muni_id, date_recorded, category), values in expenses_data.items():
        params = [muni_id, date_recorded, category, values["actual"], values["adjusted"]]

        try:
            cursor.execute(expenses_sql, params)
        except Exception as e:
            logging.error(f"Failed to insert budget data for municipality ID {muni_id}: {e}")
            continue

    for (muni_id, date_recorded, category), values in income_data.items():
        params = [muni_id, date_recorded, category, values["actual"], values["adjusted"]]

        try:
            cursor.execute(income_sql, params)
        except Exception as e:
            logging.error(f"Failed to insert budget data for municipality ID {muni_id}: {e}")
            continue

    cursor.connection.commit()
    cursor.close()

    table_service.update_stats_table("budget_data")

