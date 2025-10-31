from src.data.urls import URLS
from src.transform.formats import FORMATS
from src.utils.consts import RAW_DIR
import requests

def fetch_all_data():
    print("Fetching data")
    for name, (url, ext, read) in URLS.items():
        # Make the request to fetch the data
        print("Fetching", name, "from", url)
        request = requests.get(url)
        request.raise_for_status()

        # Save the raw data to a file
        file_path = RAW_DIR / f"{name}.{ext}"
        file_path.write_text(request.text, encoding="utf-8")
        print("Saved to", file_path)

        # Decode the data using the appropriate format decoder
        data = FORMATS[ext](file_path)
        read(data)

