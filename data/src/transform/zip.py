import zipfile
import tempfile
import logging
from pathlib import Path
from .csv import decode as decode_csv
from .xlsx import decode as decode_xlsx


def decode(zip_path: str) -> dict[str, list[dict]]:
    results: dict[str, list[dict]] = {}
    path = Path(zip_path)
    if not path.exists():
        raise FileNotFoundError(path)

    with tempfile.TemporaryDirectory() as td:
        tmpdir = Path(td)
        with zipfile.ZipFile(path, "r") as zf:
            for member in zf.infolist():
                if member.is_dir():
                    continue
                safe_rel = Path(member.filename)

                if safe_rel.is_absolute() or ".." in safe_rel.parts:
                    logging.warning("Skipped: %s", member.filename)
                    continue

                dest = tmpdir.joinpath(*safe_rel.parts)
                dest.parent.mkdir(parents=True, exist_ok=True)
                try:
                    data = zf.read(member)
                    dest.write_bytes(data)
                except Exception as e:
                    logging.exception("Write/read error %s: %s", member.filename, e)
                    results[member.filename] = []
                    continue

                file_extension = dest.suffix.lower()
                rows = []
                try:
                    if file_extension == '.csv':
                        rows = decode_csv(str(dest))
                        results[member.filename] = rows
                        logging.info("Decoding %s as CSV -> %d lines", member.filename, len(rows))
                    elif file_extension == '.xlsx':
                        xlsx_data = decode_xlsx(str(dest))
                        for sheet_name, sheet_rows in xlsx_data.items():
                            key = f"{member.filename}_{sheet_name}"
                            results[key] = sheet_rows
                            logging.info("Decoding %s sheet %s as XLSX -> %d lines", member.filename, sheet_name,
                                         len(sheet_rows))
                    else:
                        logging.warning("Unknown file type %s in zip. Skipping.", member.filename)
                        results[member.filename] = []
                except Exception as e:
                    logging.exception("Decode error %s: %s", member.filename, e)
                    if file_extension == '.xlsx':
                        results[member.filename] = []
                    else:
                        results[member.filename] = []
    return results