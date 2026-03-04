import db.connection as db_conn
import services.table_service as table_service
import logging

from typing import List, Dict
from services.csu_service import get_general_data


def read_by_age(data: list[dict]):
    cursor = db_conn.connection.cursor()

    raw_data = get_general_data(data, "01-01", "Věkové skupiny (základní)", "UZ01234596C", "Rok")

    category_mapping = {
        "0 - 14 let": "0 - 14",
        "15 - 64 let": "15 - 64",
        "65 a více let": "65+"
    }
    db_columns = ["0 - 14", "15 - 64", "65+"]
    grouped_data: Dict[tuple, Dict[str, int]] = {}

    for record in raw_data:
        key = (record['municipality_id'], record['date_recorded'])
        api_category = record['identifier'].strip() if record['identifier'] else ""

        if api_category not in category_mapping:
            continue

        db_col_name = category_mapping[api_category]

        if key not in grouped_data:
            grouped_data[key] = {}

        try:
            grouped_data[key][db_col_name] = int(record['value'])
        except (ValueError, TypeError):
            logging.warning(
                f"Invalid value '{record['value']}' for {db_col_name} in muni {record['municipality_zuj']}")
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

    table_service.update_stats_table("population_by_age_data")