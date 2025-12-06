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