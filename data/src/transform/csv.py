import csv
import chardet
import io

_CZECH_CHARS = set("ěščřžýáíéúůťňďĚŠČŘŽÝÁÍÉÚŮŤŇĎ")
_MOJIBAKE_MARKERS = ("Ã", "Â", "Ä", "Ă")


def _score_text(text: str) -> int:
    cz = sum(1 for ch in text if ch in _CZECH_CHARS)
    markers = sum(text.count(m) for m in _MOJIBAKE_MARKERS)
    return cz - markers * 5


def _try_repairs(raw: bytes, enc: str) -> list[tuple[str, str]]:
    results = []
    try:
        decoded = raw.decode(enc, errors="replace")
        results.append((decoded, enc))
        try:
            fixed = decoded.encode("latin-1", errors="replace").decode("utf-8", errors="replace")
            results.append((fixed, f"{enc} -> latin1->utf8"))
        except Exception:
            pass
        try:
            rev = decoded.encode("utf-8", errors="replace").decode("latin-1", errors="replace")
            results.append((rev, f"{enc} -> utf8->latin1"))
        except Exception:
            pass
    except Exception:
        pass
    return results


def _detect_best_encoding(file_path: str, sample_size: int = 200000) -> tuple[str, str]:
    with open(file_path, "rb") as bf:
        raw = bf.read(sample_size)

    chard = chardet.detect(raw)
    detected_enc = chard.get("encoding")
    candidates = []
    if detected_enc:
        candidates.append(detected_enc)
    for e in ("utf-8-sig", "utf-8", "cp1250", "iso-8859-2", "latin1"):
        if e not in candidates:
            candidates.append(e)

    best_enc = ""
    best_method = "binary"
    best_score = -10 ** 9
    for enc in candidates:
        for text, method in _try_repairs(raw, enc):
            score = _score_text(text)
            if score > best_score or (score == best_score and enc == detected_enc):
                best_score = score
                best_enc = enc
                best_method = method

    if best_score < 0:
        try:
            best_enc = "cp1250"
            best_method = "cp1250-fallback"
        except Exception:
            best_enc = "utf-8"
            best_method = "utf8-fallback"
    return best_enc, best_method


def _apply_method_to_raw(raw: bytes, enc: str, method: str) -> str:
    try:
        if method == enc:
            return raw.decode(enc, errors="replace")
        if "latin1->utf8" in method:
            decoded = raw.decode(enc, errors="replace")
            return decoded.encode("latin-1", errors="replace").decode("utf-8", errors="replace")
        if "utf8->latin1" in method:
            decoded = raw.decode(enc, errors="replace")
            return decoded.encode("utf-8", errors="replace").decode("latin-1", errors="replace")
        if method == "cp1250-fallback":
            return raw.decode("cp1250", errors="replace")
        if method == "utf8-fallback":
            return raw.decode("utf-8", errors="replace")
        return raw.decode(enc, errors="replace")
    except Exception:
        return raw.decode("utf-8", errors="replace")


def decode(file_path: str) -> list[dict]:
    enc, method = _detect_best_encoding(file_path)
    with open(file_path, "rb") as bf:
        full_raw_bytes = bf.read()

    decoded_text = _apply_method_to_raw(full_raw_bytes, enc, method)
    final_encoding_for_reencode = enc

    if "latin1->utf8" in method:
        final_encoding_for_reencode = "utf-8"
    elif "utf8->latin1" in method:
        final_encoding_for_reencode = "latin-1"
    elif "cp1250-fallback" in method:
        final_encoding_for_reencode = "cp1250"
    elif "utf8-fallback" in method:
        final_encoding_for_reencode = "utf-8"

    re_encoded_bytes = decoded_text.encode(final_encoding_for_reencode, errors='replace')
    byte_stream = io.BytesIO(re_encoded_bytes)
    text_wrapper = io.TextIOWrapper(byte_stream, encoding=final_encoding_for_reencode, newline='')

    first = None
    current_pos = text_wrapper.tell()
    for line in text_wrapper:
        if line.strip():
            first = line
            break
        current_pos = text_wrapper.tell()

    if not first:
        return []

    delimiter = ";" if ";" in first else ","

    text_wrapper.seek(0)

    reader = csv.DictReader(text_wrapper, delimiter=delimiter)
    return [row for row in reader]