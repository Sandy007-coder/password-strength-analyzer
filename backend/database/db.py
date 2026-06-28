import logging
import os
import sqlite3
from contextlib import contextmanager
from typing import Generator

from config import Config
from models.password_model import PasswordRecord

logger = logging.getLogger(__name__)

_SCHEMA = """
CREATE TABLE IF NOT EXISTS password_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    bcrypt_hash TEXT    NOT NULL,
    sha256_fp   TEXT    NOT NULL UNIQUE,
    strength    TEXT    NOT NULL,
    score       INTEGER NOT NULL,
    entropy     REAL    NOT NULL,
    created_at  TEXT    NOT NULL
);
"""

_PRAGMA_WAL = "PRAGMA journal_mode=WAL;"
_PRAGMA_FK  = "PRAGMA foreign_keys=ON;"


@contextmanager
def _db() -> Generator[sqlite3.Connection, None, None]:
    db_path = Config.DATABASE_PATH
    parent  = os.path.dirname(db_path)

    if parent:
        os.makedirs(parent, exist_ok=True)

    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row

    try:
        conn.execute(_PRAGMA_WAL)
        conn.execute(_PRAGMA_FK)
        yield conn
    except sqlite3.Error as exc:
        conn.rollback()
        logger.error("Database error: %s", exc, exc_info=True)
        raise
    finally:
        conn.close()


def init_db() -> None:
    with _db() as conn:
        conn.execute(_SCHEMA)
        conn.commit()
    logger.info("Database initialised at %s", Config.DATABASE_PATH)


def fingerprint_exists(sha256_fp: str) -> bool:
    with _db() as conn:
        row = conn.execute(
            "SELECT 1 FROM password_history WHERE sha256_fp = ? LIMIT 1",
            (sha256_fp,),
        ).fetchone()
    return row is not None


def insert_password_record(record: PasswordRecord) -> int:
    with _db() as conn:
        count = conn.execute(
            "SELECT COUNT(*) FROM password_history"
        ).fetchone()[0]

        if count >= Config.MAX_HISTORY:
            conn.execute(
                """
                DELETE FROM password_history
                WHERE id = (
                    SELECT id FROM password_history
                    ORDER BY created_at ASC
                    LIMIT 1
                )
                """
            )
            logger.debug("History cap (%d) reached — evicted oldest record.", Config.MAX_HISTORY)

        cursor = conn.execute(
            """
            INSERT INTO password_history
                (bcrypt_hash, sha256_fp, strength, score, entropy, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                record.bcrypt_hash,
                record.sha256_fp,
                record.strength,
                record.score,
                record.entropy,
                record.created_at,
            ),
        )
        conn.commit()

    logger.debug("Inserted password record id=%d", cursor.lastrowid)
    return cursor.lastrowid


def fetch_all_records() -> list[dict]:
    with _db() as conn:
        rows = conn.execute(
            """
            SELECT id, strength, score, entropy, created_at
            FROM   password_history
            ORDER  BY created_at DESC
            """
        ).fetchall()
    return [dict(r) for r in rows]


def clear_all_records() -> int:
    with _db() as conn:
        result = conn.execute("DELETE FROM password_history")
        conn.commit()

    logger.info("Cleared %d password history record(s).", result.rowcount)
    return result.rowcount