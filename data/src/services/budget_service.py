import logging
import requests
from data.finances.budget import read_budget_files
from data.urls import URLS

BUDGET_URL = "https://monitor.statnipokladna.gov.cz/data/extrakty/csv/FinM/{0}.zip"
MONITOR_URL = "https://monitor.statnipokladna.gov.cz/api/opendata/monitor"

def update_URLS_with_budget():
    response = requests.get(MONITOR_URL)

    if response.status_code == 404:
        logging.warning(f"No statni pokladna monitor data, skipping")
        return

    response.raise_for_status()

    data = response.json()

    for url in data["datová_sada"]:
        if "FinM" in url:
            parts = url.split("/")
            filename = parts[-1]
            url = BUDGET_URL.format(filename)

            URLS[filename] = (
                url,
                "zip",
                read_budget_files,
                "budget_data",
                30 * 24 * 60 * 60,
            )