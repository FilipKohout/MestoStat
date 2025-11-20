import csv

def decode(file_path: str) -> list[dict]:
    encodings = ["utf-8", "cp1250"]

    for enc in encodings:
        try:
            with open(file_path, mode="r", encoding=enc) as file:
                reader = csv.DictReader(file, delimiter=";")
                data = [row for row in reader]
            return data
        except UnicodeDecodeError:
            continue

    raise UnicodeDecodeError("Failed to decode file with tried encodings")