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

def _get_category(paragraph: str) -> str:
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
    data = {}

    for entry in rows:
        ico = str(entry.get("ZC_ICO:ZC_ICO")).strip()[2:]
        date = str(entry.get("0FISCPER:0FISCPER")).strip()
        state = str(entry.get("ZCMMT_ITM:ZCMMT_ITM")).strip()
        paragraph = str(entry.get("0FUNC_AREA:0FUNC_AREA")).strip()
        actual = _parse_money(entry.get("ZU_ROZKZ:ZU_ROZKZ"))
        adjusted = _parse_money(entry.get("ZU_ROZPZM:ZU_ROZPZM"))

        # Filter only expenses
        if not (state.startswith("5") or state.startswith("6")):
            continue

        date_recorded = date[:4] + "-" + date[5:7] + "-1"
        category = _get_category(paragraph)
        muni_id = structure_service.find_municipality_by_ico(ico)

        if not muni_id:
            logging.warning(f"Municipality with IČO {ico} not found, skipping budget entry")
            continue

        key = (muni_id, date_recorded, category)

        if key not in data:
            data[key] = {"actual": 0.0, "adjusted": 0.0}

        data[key]["actual"] += actual
        data[key]["adjusted"] += adjusted

    sql = """
        INSERT INTO budget_data
            (municipality_id, date_recorded, category_name, actual_spending, budget_adjusted)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (municipality_id, date_recorded, category_name) DO NOTHING; 
    """

    for (muni_id, date_recorded, category), values in data.items():
        params = [muni_id, date_recorded, category, values["actual"], values["adjusted"]]

        try:
            cursor.execute(sql, params)
        except Exception as e:
            logging.error(f"Failed to insert budget data for municipality ID {muni_id}: {e}")
            continue

    cursor.connection.commit()
    cursor.close()

    table_service.update_stats_table("budget_data")

