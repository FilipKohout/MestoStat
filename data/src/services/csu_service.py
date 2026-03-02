from typing import List, Dict

import db.connection as db_conn
import logging

from services.structure_service import find_municipality_by_name, find_municipality_by_zuj


def get_general_data(data: list[dict], date: str, identifierKey: str, municipalityKey: str, yearKey: str, valueKey: str = "Hodnota") -> List[dict]:
    cursor = db_conn.connection.cursor()

    general_data = []

    for entry in data:
        municipality_zuj = entry.get(municipalityKey)
        identifier = entry.get(identifierKey)
        year = entry.get(yearKey)
        value = entry.get(valueKey)

        if not municipality_zuj or not year or value in (None, ""):
            continue

        try:
            year = int(year)
        except ValueError:
            logging.warning("Invalid year '%s' in municipality ZUJ %s", year, municipality_zuj)
            continue

        municipality_id = find_municipality_by_zuj(municipality_zuj)

        if municipality_id is None:
            continue

        date_recorded = f"{year}-{date}"

        general_data.append({
            "municipality_id": municipality_id,
            "municipality_zuj": municipality_zuj,
            "date_recorded": date_recorded,
            "value": value,
            "identifier": identifier,
        })

    logging.info(f"Found {len(general_data)} records to process")

    return general_data