import sqlite3
import os
from config import Config
from models.password_model import PasswordRecord


CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS password_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    bcrypt_hash TEXT    NOT NULL,           -- bcrypt hash (safe to store)
    sha256_fp   TEXT    NOT NULL UNIQUE,    -- SHA-256 fingerprint for dedup
    strength    TEXT    NOT NULL,           -- "Weak" | "Medium" | …
    score       INTEGER NOT NULL,           -- 0–10
    entropy     REAL    NOT NULL,           -- bits
    created_at  TEXT    NOT NULL            -- ISO-8601 UTC timestamp
);
"""


def _get_connection() -> sqlite3.Connection:
   
    
    db_path = Config.DATABASE_PATH
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row   
    conn.execute("PRAGMA journal_mode=WAL;")  
    return conn


def init_db() -> None:
  
    with _get_connection() as conn:
        conn.execute(CREATE_TABLE_SQL)
        conn.commit()


#  Reuse detection 

def fingerprint_exists(sha256_fp: str) -> bool:

    with _get_connection() as conn:
        row = conn.execute(
            "SELECT id FROM password_history WHERE sha256_fp = ? LIMIT 1",
            (sha256_fp,),
        ).fetchone()
    return row is not None


#  Insert 

def insert_password_record(record: PasswordRecord) -> int:

    with _get_connection() as conn:
        # Enforce rolling history cap
        count = conn.execute("SELECT COUNT(*) FROM password_history").fetchone()[0]
        if count >= Config.MAX_HISTORY:
            conn.execute(
                "DELETE FROM password_history WHERE id = ("
                "  SELECT id FROM password_history ORDER BY created_at ASC LIMIT 1"
                ")"
            )

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
    return cursor.lastrowid


#  Fetch 

def fetch_all_records() -> list[dict]:
  
    with _get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, strength, score, entropy, created_at
            FROM   password_history
            ORDER  BY created_at DESC
            """
        ).fetchall()
    return [dict(row) for row in rows]


#  Delete 

def clear_all_records() -> int:

    with _get_connection() as conn:
        cursor = conn.execute("DELETE FROM password_history")
        conn.commit()
    return cursor.rowcount
