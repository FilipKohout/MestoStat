from typing import List, Dict

import db.connection as db_conn
import logging

from utils.utils import normalize_name

municipality_map = {}

def find_municipality_by_name(municipality_name: str) -> int | None:
    cursor = db_conn.connection.cursor()

    normalized_name = normalize_name(municipality_name)

    if municipality_map.get(normalized_name) is None:
        logging.info("Loading municipalities cache...")
        cursor.execute("SELECT municipality_name, municipality_id FROM municipalities")
        results = cursor.fetchall()

        for name, m_id in results:
            norm_name = normalize_name(name)
            municipality_map[norm_name] = m_id

    municipality_id = municipality_map.get(normalized_name)

    if municipality_id is None:
        logging.warning("Municipality not found DB: %s", municipality_name)
        return None

    return municipality_id
