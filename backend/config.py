import logging
import os

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


def _int_env(key: str, default: int) -> int:
    raw = os.getenv(key)
    if raw is None:
        return default
    try:
        return int(raw)
    except ValueError:
        logger.warning("Config: %s=%r is not a valid integer — using default %d.", key, raw, default)
        return default


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-fallback-secret-key")
    FLASK_ENV:  str = os.getenv("FLASK_ENV",  "development")
    DEBUG:      bool = FLASK_ENV == "development"
    HOST:       str = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT:       int = _int_env("FLASK_PORT",   5000)

    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "database/passwords.db")

    BCRYPT_ROUNDS: int = _int_env("BCRYPT_ROUNDS", 12)
    MAX_HISTORY:   int = _int_env("MAX_HISTORY",   100)

    GOOD_LENGTH_THRESHOLD: int = 12

    SCORE_BANDS: tuple[tuple[int, int, str], ...] = (
        (0,  3,  "Weak"),
        (4,  5,  "Medium"),
        (6,  7,  "Strong"),
        (8,  10, "Very Strong"),
    )

    if SECRET_KEY == "dev-fallback-secret-key" and FLASK_ENV == "production":
        raise RuntimeError(
            "SECRET_KEY must be set to a strong random value in production. "
            "Generate one with: python -c \"import secrets; print(secrets.token_hex(64))\""
        )