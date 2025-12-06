import transform.json as json
import transform.csv as csv
from transform.zip import decode as zip_dec
from transform.xlsx import decode as xlsx_dec
from typing import Any, Callable, Dict, Final

FORMATS: Final[Dict[
    str,
    Callable[[str], Any]
]] = {
    "json": json.decode,
    "csv": csv.decode,
    "zip": zip_dec,
    "xlsx": xlsx_dec,
}