import os
import time
import logging
import psycopg2
from psycopg2 import OperationalError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

required = {"DB_HOST": DB_HOST, "DB_PORT": DB_PORT, "DB_NAME": DB_NAME, "DB_USER": DB_USER, "DB_PASS": DB_PASS}
missing = [k for k, v in required.items() if not v]
if missing:
    raise RuntimeError(f"Missing ENV: {', '.join(missing)}")

try:
    DB_PORT = int(DB_PORT)
except ValueError:
    raise RuntimeError("DB_PORT must be a number")

def connect_with_retries(max_attempts: int = 10, initial_delay: float = 1.0):
    attempt = 0
    delay = initial_delay
    while attempt < max_attempts:
        attempt += 1
        try:
            logger.info("Connecting to DB (attempt %d/%d)...", attempt, max_attempts)
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASS,
                connect_timeout=5
            )
            logger.info("DB connection established")
            return conn
        except OperationalError as e:
            logger.warning("Failed to connect to DB: %s", e)
            if attempt >= max_attempts:
                logger.error("Max connection attempts reached")
                raise
            time.sleep(delay)
            delay = min(delay * 2, 30.0)

connection = connect_with_retries()
