import db.connection as db_conn
import services.stats_service as stats_service
import logging

def read31stDec(data: list[dict]):
    read(data, semester=1)

def read1stJul(data: list[dict]):
    read(data, semester=2)

def read(data: list[dict], semester: int):
    cursor = db_conn.connection.cursor()

    for entry in data:
        municipality_name = entry.get("Kraje a obce-Obec")
        sex = entry.get("Pohlaví")
        year = entry.get("Roky")
        value = entry.get("Hodnota")

        if not municipality_name or not year or value in (None, ""):
            continue

        try:
            year = int(year)
        except ValueError:
            logging.warning("Invalid year '%s' in municipality %s", year, municipality_name)
            continue

        cursor.execute("""
            SELECT municipality_id 
            FROM municipalities 
            WHERE municipality_name = %s
        """, (municipality_name,))
        row = cursor.fetchone()

        if row is None:
            logging.warning("Municipality not found DB: %s", municipality_name)
            continue

        municipality_id = row[0]

        males = None
        females = None

        if str.lower(sex) == "muži": males = value
        elif str.lower(sex) == "ženy": females = value
        elif str.lower(sex) == "celkem": continue
        else:
            logging.warning("Invalid sex '%s' in municipality %s", sex, municipality_name)
            continue

        date_recorded = f"{year+1}-01-01" if semester == 1 else f"{year}-07-01"
        cursor.execute("""
            INSERT INTO population_by_sex_data 
                (date_recorded, municipality_id, males, females)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (date_recorded, municipality_id)
            DO UPDATE SET
                males = GREATEST(population_by_sex_data.males, EXCLUDED.males, 0),
                females = GREATEST(population_by_sex_data.females, EXCLUDED.females, 0)
            RETURNING data_id;
        """, (date_recorded, municipality_id, 0 if males is None else males, 0 if females is None else females))

        inserted = cursor.fetchone()
        logging.info("Inserted/updated population record for %s (%s)", municipality_name, date_recorded)
    db_conn.connection.commit()
    cursor.close()

    stats_service.update_stats_table("population_by_sex")
