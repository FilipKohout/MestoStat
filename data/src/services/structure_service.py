from typing import List, Dict

import db.connection as db_conn
import logging

from utils.utils import normalize_name

municipality_map_by_name = {}
municipality_map_by_ico = {}

def find_municipality_by_name(municipality_name: str) -> int | None:
    cursor = db_conn.connection.cursor()

    normalized_name = normalize_name(municipality_name)

    if municipality_map_by_name == {}:
        logging.info("Loading municipalities cache...")
        cursor.execute("SELECT municipality_name, municipality_id FROM municipalities")
        results = cursor.fetchall()

        for name, m_id in results:
            norm_name = normalize_name(name)
            municipality_map_by_name[norm_name] = m_id

    municipality_id = municipality_map_by_name.get(normalized_name)

    if municipality_id is None:
        logging.warning("Municipality name not found DB: %s", municipality_name)
        return None

    return municipality_id

def find_municipality_by_ico(municipality_ico: str) -> int | None:
    cursor = db_conn.connection.cursor()

    if municipality_map_by_ico == {}:
        logging.info("Loading municipalities cache...")
        cursor.execute("SELECT municipality_id, ico FROM municipalities")
        results = cursor.fetchall()

        for (id, ico) in results:
            municipality_map_by_ico[ico] = id

    municipality_id = municipality_map_by_ico.get(municipality_ico)

    if municipality_id is None:
        logging.warning("Municipality ICO not found DB: %s", municipality_ico)
        return None

    return municipality_id