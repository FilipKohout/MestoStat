from typing import List, Dict

import db.connection as db_conn
import logging

from services.structure_service import find_municipality_by_name


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

        municipality_id = find_municipality_by_name(municipality_name)

        if municipality_id is None:
            continue

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