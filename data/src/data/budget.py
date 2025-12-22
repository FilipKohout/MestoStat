import logging
import db.connection as db_conn


def read_budget_files(data: dict[str, list[dict]]):
    for sheet_name, rows_list in data.items():
        if not rows_list:
            continue

        logging.info(f"Processing sheet: {sheet_name} ({len(rows_list)} rows)")
        read_budget_data(rows_list)

def read_budget_data(data: list[dict]):
    cursor = db_conn.connection.cursor()

    #logging.info(data)

    sql = """
    """

    processed_count = 0