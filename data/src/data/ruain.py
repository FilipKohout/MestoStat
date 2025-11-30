import db.connection as db_conn
import logging

from services.wiki_image_service import get_all_municipality_images


def read(data: list[dict]):
    municipalities = []
    districts = []
    regions = []

    for entry in data:
        district = {
            "districtName": entry.get("Název Okresu"),
            "districtCodeRUIAN": entry.get("Kód Okresu"),
            "regionName": entry.get("Název Okresu"),
            "regionCodeRUIAN": entry.get("Kód Kraje (VÚSC)")
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
            "municipalityStatus": entry.get("Status obce"),
            "districtName": entry.get("Název Kraje (VÚSC)"),
            "districtCodeRUIAN": entry.get("Kód Okresu"),
            "regionCodeRUIAN": entry.get("Kód Kraje (VÚSC)"),
            "regionName": entry.get("Název Okresu"),
        }

        municipalities.append(municipality)
    cursor = db_conn.connection.cursor()

    region_ids = {}
    for region in regions:
        cursor.execute("""
            INSERT INTO regions (region_name, region_code_ruian)
            VALUES (%(regionName)s, %(regionCodeRUIAN)s)
            ON CONFLICT (region_code_ruian) DO NOTHING
            RETURNING region_id;
        """, region)

        row = cursor.fetchone()
        if row is not None:
            region_id = row[0]
            region_ids[region["regionCodeRUIAN"]] = region_id

            #logging.info("Inserted/Found region: %s with ID %d", region["regionName"], region_id)

    district_ids = {}
    for district in districts:
        region_id = region_ids.get(district["regionCodeRUIAN"])

        cursor.execute("""
            INSERT INTO districts (district_name, district_code_ruian, region_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (district_code_ruian) DO NOTHING
            RETURNING district_id;
        """, (district["districtName"], district["districtCodeRUIAN"], region_id))

        row = cursor.fetchone()
        if row is not None:
            district_id = row[0]
            district_ids[district["districtCodeRUIAN"]] = district_id

            #logging.info("Inserted/Found district: %s with ID %d", district["districtName"], district_id)

    wiki_images_map = get_all_municipality_images()

    #for image in wiki_images_map.items():
        #logging.info("Wikidata image: %s -> %s", image[0], image[1])

    for municipality in municipalities:
        district_id = district_ids.get(municipality["districtCodeRUIAN"])
        region_id = region_ids.get(municipality["regionCodeRUIAN"])
        image_url = wiki_images_map.get(municipality["municipalityName"])

        cursor.execute("""
            INSERT INTO municipalities (municipality_name, municipality_status, district_id, region_id, municipality_image_url)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (municipality_name) DO NOTHING;
        """, (municipality["municipalityName"], municipality["municipalityStatus"], district_id, region_id, image_url))

        #logging.info("Inserted/Found municipality: %s", municipality["municipalityName"])

    db_conn.connection.commit()
    cursor.close()