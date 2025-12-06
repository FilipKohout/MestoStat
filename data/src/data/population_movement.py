import db.connection as db_conn
import services.stats_service as stats_service
import logging

from services.structure_service import find_municipality_by_name
from utils.utils import clean_key, parse_int


def read_demographics_sheets(data: dict[str, list[dict]]):
    logging.info("Starting dispatch of demographic data...")

    for sheet_name, rows_list in data.items():
        if not rows_list:
            continue

        logging.info(f"Processing sheet: {sheet_name} ({len(rows_list)} rows)")

        if "OD_KAM" in sheet_name:
            pass
        else:
            read_population_movement_historic(rows_list)

    logging.info("Dispatch finished.")

def read_population_movement_historic(rows: list[dict]):
    cursor = db_conn.connection.cursor()

    sql = """
          INSERT INTO population_movement_data
          (date_recorded, municipality_id, population_total,
           births, deaths, immigrants, emigrants)
          VALUES (%s, %s, %s, %s, %s, %s, %s) ON CONFLICT (municipality_id, date_recorded)
          DO UPDATE SET
              population_total = EXCLUDED.population_total,
              births = EXCLUDED.births,
              deaths = EXCLUDED.deaths,
              immigrants = EXCLUDED.immigrants,
              emigrants = EXCLUDED.emigrants;
          """

    processed_count = 0

    for row in rows:
        try:
            if not isinstance(row, dict):
                continue

            clean_row = {clean_key(k): v for k, v in row.items()}

            year_val = clean_row.get('rok')
            if not year_val:
                continue
            date_recorded = f"{year_val}-01-01"

            muni_name = None
            for k, v in clean_row.items():
                if 'název' in k and 'obce' in k:
                    muni_name = v
                    break

            if not muni_name:
                continue

            municipality_id = find_municipality_by_name(muni_name)

            if municipality_id is None:
                continue

            births = 0
            deaths = 0
            immigrants = 0
            emigrants = 0
            pop_total = 0

            for k, v in clean_row.items():
                k_lower = str(k).lower()
                val = parse_int(v)

                if 'narození' in k_lower:
                    births = val
                elif 'zemřelí' in k_lower:
                    deaths = val
                elif 'přistě' in k_lower:
                    immigrants = val
                elif 'vystě' in k_lower:
                    emigrants = val
                elif 'stav' in k_lower and '1.1' in k_lower:
                    pop_total = val

            params = [
                date_recorded,
                municipality_id,
                pop_total,
                births,
                deaths,
                immigrants,
                emigrants
            ]

            cursor.execute(sql, params)
            processed_count += 1

        except Exception as e:
            logging.error(f"Error processing demographic stats row: {e}")
            continue

    logging.info(f"Saved {processed_count} historic records.")

    db_conn.connection.commit()
    cursor.close()

    stats_service.update_stats_table("population_movement_data")