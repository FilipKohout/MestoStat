from data.urls import URLS
from transform.formats import FORMATS
from utils.consts import RAW_DIR

import logging
import requests

def fetch_all_data():
    logging.info("Fetching all data")

    for name, (url, ext, read) in URLS.items():
        # Make the request to fetch the data
        logging.info(f"Fetching {name}")
        request = requests.get(url)
        request.raise_for_status()

        # Save the raw data to a file
        file_path = RAW_DIR / f"{name}.{ext}"
        file_path.write_text(request.text, encoding="utf-8")
        logging.info(f"Saved {name}")

        # Decode the data using the appropriate format decoder
        data = FORMATS[ext](file_path)
        read(data)

