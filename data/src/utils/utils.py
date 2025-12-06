from typing import Any


def clean_key(key: str) -> str:
    if not key:
        return ""

    return key.replace('\n', '').replace('-', '').replace(' ', '').lower()

def parse_int(value: Any) -> int:
    if value is None:
        return 0
    if isinstance(value, str):
        cleaned = value.strip()
        if not cleaned or cleaned == '-':
            return 0
        try:
            return int(cleaned)
        except ValueError:
            return 0
    return int(value)

def normalize_name(name):
    if not name:
        return ""
    return str(name).strip().lower()