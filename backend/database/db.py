import os
import sqlite3

from config import Config
from models.password_model import PasswordRecord


PASSWORD_HISTORY_TABLE_SQL = """
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


def _create_connection() -> sqlite3.Connection:
    """
    Create and configure a SQLite connection.
    """
    database_path = Config.DATABASE_PATH

    database_directory = os.path.dirname(database_path)
    if database_directory:
        os.makedirs(database_directory, exist_ok=True)

    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row

    # Improves concurrent read/write behavior for SQLite.
    connection.execute("PRAGMA journal_mode=WAL;")

    return connection


def init_db() -> None:
    """
    Initialize required database schema.
    """
    with _create_connection() as connection:
        connection.execute(PASSWORD_HISTORY_TABLE_SQL)
        connection.commit()


def fingerprint_exists(sha256_fingerprint: str) -> bool:
    """
    Check whether a password fingerprint already exists.
    """
    with _create_connection() as connection:
        existing_record = connection.execute(
            """
            SELECT id
            FROM password_history
            WHERE sha256_fp = ?
            LIMIT 1
            """,
            (sha256_fingerprint,),
        ).fetchone()

    return existing_record is not None


def insert_password_record(record: PasswordRecord) -> int:
    """
    Store a password record while enforcing the configured history limit.
    """
    with _create_connection() as connection:
        total_records = connection.execute(
            "SELECT COUNT(*) FROM password_history"
        ).fetchone()[0]

        if total_records >= Config.MAX_HISTORY:
            connection.execute(
                """
                DELETE FROM password_history
                WHERE id = (
                    SELECT id
                    FROM password_history
                    ORDER BY created_at ASC
                    LIMIT 1
                )
                """
            )

        cursor = connection.execute(
            """
            INSERT INTO password_history (
                bcrypt_hash,
                sha256_fp,
                strength,
                score,
                entropy,
                created_at
            )
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

        connection.commit()

        return cursor.lastrowid


def fetch_all_records() -> list[dict]:
    """
    Retrieve password history metadata ordered by creation date.
    """
    with _create_connection() as connection:
        records = connection.execute(
            """
            SELECT
                id,
                strength,
                score,
                entropy,
                created_at
            FROM password_history
            ORDER BY created_at DESC
            """
        ).fetchall()

    return [dict(record) for record in records]


def clear_all_records() -> int:
    """
    Remove all stored password history records.
    """
    with _create_connection() as connection:
        result = connection.execute("DELETE FROM password_history")
        connection.commit()

        return result.rowcount