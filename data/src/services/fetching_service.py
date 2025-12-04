import time
import logging
import requests

from pathlib import Path
from data.urls import URLS
from transform.formats import FORMATS
from utils.consts import RAW_DIR
from services.stats_service import get_last_updated


def fetch_all_data():
    logging.info("Fetching all data")

    Path(RAW_DIR).mkdir(parents=True, exist_ok=True)

    for name, (url, ext, read, table_name, update_period) in URLS.items():
        file_path = RAW_DIR / f"{name}.{ext}"

        last_updated = get_last_updated(table_name)
        now = time.time()

        need_fetch = False

        if last_updated is None:
            need_fetch = True
        elif isinstance(update_period, int) and (last_updated + update_period < now):
            need_fetch = True
        elif not file_path.exists():
            need_fetch = True

        if need_fetch:
            logging.info(f"Fetching {name} from {url}")
            response = requests.get(url)
            response.raise_for_status()

            file_path.write_text(response.text, encoding="utf-8")
            logging.info(f"Saved raw file for {name}")

            data = None

        try:
            logging.info(f"Converting {name} from {ext} format")
            data = FORMATS[ext](file_path)
        except Exception as e:
            logging.error(f"Failed to decode {file_path}: {e}")

        if data is not None:
            try:
                logging.info(f"Processing data from {name}")
                read(data)
            except Exception as e:
                logging.error(f"Failed to process {name}: {e}")
        else:
            logging.error(f"Couldn't get any data from file {file_path}")

    logging.info("Synced all data, database is up to date")