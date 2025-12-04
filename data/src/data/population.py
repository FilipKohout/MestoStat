import db.connection as db_conn
import services.stats_service as stats_service
import logging

from typing import List, Dict
from services.csu_service import get_general_data


def read_by_sex(data: list[dict], semester: int):
    cursor = db_conn.connection.cursor()

    raw_data = get_general_data(data, "01-01" if semester == 1 else "07-01", "Pohlaví", "Kraje a obce-Obec", "Roky")
    grouped_data: Dict[tuple, Dict[str, int]] = {}

    for record in raw_data:
        key = (record['municipality_id'], record['date_recorded'])
        identifier = record['identifier'].strip().lower() if record['identifier'] else ""

        if identifier == "muži":
            db_col_name = "males"
        elif identifier == "ženy":
            db_col_name = "females"
        else:
            continue

        if key not in grouped_data:
            grouped_data[key] = {}

        try:
            grouped_data[key][db_col_name] = int(record['value'])
        except (ValueError, TypeError):
            continue

    sql = """
        INSERT INTO population_by_sex_data 
            (date_recorded, municipality_id, males, females)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (municipality_id, date_recorded)
        DO UPDATE SET
            males = EXCLUDED.males,
            females = EXCLUDED.females;
    """

    for (muni_id, date_rec), values_dict in grouped_data.items():
        males_val = values_dict.get("males", 0)
        females_val = values_dict.get("females", 0)

        params = [date_rec, muni_id, males_val, females_val]

        try:
            cursor.execute(sql, params)
        except Exception as e:
            logging.error(f"Failed to insert sex data for municipality ID {muni_id}: {e}")
            db_conn.connection.rollback()
            continue

    db_conn.connection.commit()
    cursor.close()

    stats_service.update_stats_table("population_by_sex_data")


def read_by_age(data: list[dict], semester: int):
    cursor = db_conn.connection.cursor()

    raw_data = get_general_data(data, "01-01" if semester == 1 else "07-01", "Věkové skupiny (pětileté)", "Všechna území", "Rok")

    db_columns = [
        "0", "1 - 4", "5 - 9", "10 - 14", "15 - 19", "20 - 24",
        "25 - 29", "30 - 34", "35 - 39", "40 - 44", "45 - 49",
        "50 - 54", "55 - 59", "60 - 64", "65 - 69", "70 - 74",
        "75 - 79", "80 - 84", "85 - 89", "90 - 94", "95+"
    ]

    grouped_data: Dict[tuple, Dict[str, int]] = {}

    for record in raw_data:
        key = (record['municipality_id'], record['date_recorded'])
        api_category = record['identifier'].strip() if record['identifier'] else ""

        if api_category == "95 a více":
            db_col_name = "95+"
        else:
            db_col_name = api_category

        if db_col_name not in db_columns:
            continue

        if key not in grouped_data:
            grouped_data[key] = {}

        try:
            grouped_data[key][db_col_name] = int(record['value'])
        except (ValueError, TypeError):
            logging.warning(
                f"Invalid value '{record['value']}' for {db_col_name} in muni {record['municipality_name']}")
            continue

    cols_sql = ", ".join([f'"{c}"' for c in db_columns])
    placeholders = ", ".join(["%s"] * len(db_columns))
    update_clause = ", ".join([f'"{c}" = EXCLUDED."{c}"' for c in db_columns])

    sql = f"""
        INSERT INTO population_by_age_data 
            (date_recorded, municipality_id, {cols_sql})
        VALUES (%s, %s, {placeholders})
        ON CONFLICT (municipality_id, date_recorded)
        DO UPDATE SET
            {update_clause};
    """

    for (muni_id, date_rec), values_dict in grouped_data.items():
        row_values = [values_dict.get(col, 0) for col in db_columns]
        params = [date_rec, muni_id] + row_values

        try:
            cursor.execute(sql, params)
        except Exception as e:
            logging.error(f"Failed to insert age data for municipality ID {muni_id}: {e}")
            db_conn.connection.rollback()
            continue

    db_conn.connection.commit()
    cursor.close()

    stats_service.update_stats_table("population_by_age_data")
    stats_service.update_stats_table("population_by_age_data_age_grouped")
