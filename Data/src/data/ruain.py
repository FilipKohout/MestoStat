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
