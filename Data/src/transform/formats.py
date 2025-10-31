import src.transform.json as json
import src.transform.csv as csv
from typing import Any, Callable, Dict, Final

FORMATS: Final[Dict[
    str,
    Callable[[str], Any]
]] = {
    "json": json.decode,
    "csv": csv.decode,
}