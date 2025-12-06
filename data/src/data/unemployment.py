import db.connection as db_conn
import services.stats_service as stats_service
import logging

from typing import List, Dict
from services.csu_service import get_general_data


def read_unemployment(data: list[dict]):
    cursor = db_conn.connection.cursor()

    raw_data = get_general_data(data, "12-31", "", "Kraje a obce-Obec", "Roky")
    grouped_data: Dict[tuple, float] = {}

    for record in raw_data:
        key = (record['municipality_id'], record['date_recorded'])

        try:
            grouped_data[key] = float(record['value'])
        except (ValueError, TypeError):
            continue

    sql = """
        INSERT INTO unemployment_data
            (date_recorded, municipality_id, unemployed_percent)
        VALUES (%s, %s, %s)
        ON CONFLICT (municipality_id, date_recorded)
        DO UPDATE SET
            unemployed_percent = EXCLUDED.unemployed_percent;
    """

    for (muni_id, date_rec), val in grouped_data.items():
        params = [date_rec, muni_id, val]

        try:
            cursor.execute(sql, params)
        except Exception as e:
            logging.error(f"Failed to insert unemployment data for municipality ID {muni_id}: {e}")
            db_conn.connection.rollback()
            continue

    db_conn.connection.commit()
    cursor.close()

    stats_service.update_stats_table("unemployment_data")
    stats_service.update_stats_table("unemployment_data_estimated_count")
