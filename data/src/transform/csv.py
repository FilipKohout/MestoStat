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
        # common fix: UTF-8 bytes were decoded as Latin-1 -> re-decode
        try:
            fixed = decoded.encode("latin-1", errors="replace").decode("utf-8", errors="replace")
            results.append((fixed, f"{enc} -> latin1->utf8"))
        except Exception:
            pass
        # reverse attempt: decoded as utf-8 then interpreted as latin1
        try:
            rev = decoded.encode("utf-8", errors="replace").decode("latin-1", errors="replace")
            results.append((rev, f"{enc} -> utf8->latin1"))
        except Exception:
            pass
    except Exception:
        pass
    return results

def _detect_best_encoding(file_path: str, sample_size: int = 200000) -> tuple[str, str]:
    """
    Detekce kódování na vzorku souboru. Vrací (enc, method) — enc je
    původní kandidát, method je použitá oprava (např. 'cp1250' nebo 'utf-8 -> latin1->utf8').
    """
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
    best_score = -10**9
    for enc in candidates:
        for text, method in _try_repairs(raw, enc):
            score = _score_text(text)
            # prefer chardet choice when scores equal and confidence decent
            if score > best_score or (score == best_score and enc == detected_enc):
                best_score = score
                best_enc = enc
                best_method = method

    # fallback: pokud nic rozumného, pokus jako cp1250
    if best_score < 0:
        try:
            # vrátíme informaci, že fallback je cp1250
            best_enc = "cp1250"
            best_method = "cp1250-fallback"
        except Exception:
            best_enc = "utf-8"
            best_method = "utf8-fallback"
    return best_enc, best_method

def _apply_method_to_raw(raw: bytes, enc: str, method: str) -> str:
    """
    Aplikuje zvolenou metodu dekódování na celé raw bytes.
    Metody odpovídají těm, které vytváří _try_repairs a fallbacky.
    """
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
        # default safe decode
        return raw.decode(enc, errors="replace")
    except Exception:
        return raw.decode("utf-8", errors="replace")

def decode(file_path: str) -> list[dict]:
    # detekce kódování na vzorku
    enc, method = _detect_best_encoding(file_path)
    # načíst celý soubor a dekódovat podle detekce
    with open(file_path, "rb") as bf:
        full_raw = bf.read()
    text = _apply_method_to_raw(full_raw, enc, method)

    # použít StringIO do csv readeru
    sio = io.StringIO(text)
    # najít první neprázdný řádek pro odhad oddělovače
    first = None
    pos = sio.tell()
    for line in sio:
        if line.strip():
            first = line
            break
        pos = sio.tell()
    if not first:
        return []
    delimiter = ";" if ";" in first else ","
    sio.seek(0)
    reader = csv.DictReader(sio, delimiter=delimiter)
    return [row for row in reader]
