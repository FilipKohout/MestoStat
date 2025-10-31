import json

def decode(file_path: str) -> list[dict]:
    """Reads a JSON file and returns its content as a dictionary."""
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data