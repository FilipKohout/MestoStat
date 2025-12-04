from typing import List, Dict

import db.connection as db_conn
import logging

def get_general_data(data: list[dict], date: str, identifierKey: str, municipalityKey: str, yearKey: str, valueKey: str = "Hodnota") -> List[dict]:
    cursor = db_conn.connection.cursor()

    general_data = []

    for entry in data:
        municipality_name = entry.get(municipalityKey)
        identifier = entry.get(identifierKey)
        year = entry.get(yearKey)
        value = entry.get(valueKey)

        if not municipality_name or not year or value in (None, ""):
            continue

        try:
            year = int(year)
        except ValueError:
            logging.warning("Invalid year '%s' in municipality %s", year, municipality_name)
            continue

        cursor.execute("""
            SELECT municipality_id 
            FROM municipalities 
            WHERE municipality_name = %s
        """, (municipality_name,))
        row = cursor.fetchone()

        if row is None:
            logging.warning("Municipality not found DB: %s", municipality_name)
            continue

        municipality_id = row[0]
        date_recorded = f"{year}-{date}"

        general_data.append({
            "municipality_id": municipality_id,
            "municipality_name": municipality_name,
            "date_recorded": date_recorded,
            "value": value,
            "identifier": identifier,
        })

    logging.info(f"Found {len(general_data)} records to process")

    return general_data