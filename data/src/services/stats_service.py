import db.connection as db_conn

def update_stats_table(table_name: str):
    cursor = db_conn.connection.cursor()
    cursor.execute("""
        UPDATE statistics
        SET last_updated = NOW()
        WHERE table_name = %s
    """, (table_name,))

    db_conn.connection.commit()
    cursor.close()

def get_last_updated(table_name: str) -> str | None:
    cursor = db_conn.connection.cursor()
    cursor.execute("""
        SELECT last_updated
        FROM statistics
        WHERE table_name = %s
    """, (table_name,))

    row = cursor.fetchone()
    last_updated = row[0] if row else None
    cursor.close()

    return last_updated.timestamp() if last_updated else None