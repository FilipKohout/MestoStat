import src.db.connection as db_conn

def read(data: list[dict]):
    """Processes RUIAN data and returns a list of municipalities with their codes and names."""
    municipalities = []
    districts = []
    regions = []

    for entry in data:
        district = {
            "districtName": entry.get("Název Okresu"),
            "districtCodeRUIAN": entry.get("Kód Okresu")
        }
        if district not in districts:
            districts.append(district)

        region = {
            "regionName": entry.get("Název Kraje (VÚSC)"),
            "regionCodeRUIAN": entry.get("Kód Kraje (VÚSC)")
        }
        if region not in regions:
            regions.append(region)

        municipality = {
            "municipalityName": entry.get("Název Obce"),
            "municipalityStatus": entry.get("Status Obce"),
            "districtName": entry.get("Název Kraje"),
            "regionName": entry.get("Název Okresu"),
        }
        municipalities.append(municipality)

        db_conn.connection.execute("""
            INSERT OR IGNORE INTO districts (district_name, district_code_ruian)
            VALUES (:districtName, :districtCodeRUIAN)
        """, district)

        db_conn.connection.execute("""
           INSERT OR IGNORE INTO regions (region_name, region_code_ruian)
           VALUES (:regionName, :regionCodeRUIAN)
        """, region)

        db_conn.connection.execute("""
           INSERT OR IGNORE INTO municipalities (municipality_name, municipality_status, district_name, region_name)
           VALUES (:municipalityName, :municipalityStatus, :districtName, :regionName)
        """, municipality)