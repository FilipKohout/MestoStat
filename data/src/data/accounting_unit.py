import logging

import db.connection as db_conn

allowed_sub_types = ["11", "12", "41", "50", "51", "52", "42", "43", "60", "61"]

def read(data: list[dict]):
    cursor = db_conn.connection.cursor()

    for entry in data:
        sub_type = entry.get("/BIC/ZC_URADF Poddruh účetní jednotky")

        if sub_type in allowed_sub_types:
            zuj = entry.get("/BIC/ZC_ZUJ Základní územní jednotka")
            ico = entry.get("/BIC/ZC_ICO IČO")
            dic = entry.get("/BIC/ZC_DIC DIČ")

            cursor.execute("""
                UPDATE municipalities
                SET ico = %s, dic = %s
                WHERE zuj = %s
            """, (ico, dic, zuj))

    db_conn.connection.commit()
    cursor.close()