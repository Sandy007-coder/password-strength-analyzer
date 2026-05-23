import os
from dotenv import load_dotenv

# Load variables from the .env file into os.environ
load_dotenv()


class Config:
    """Central configuration class for the whole application."""

    # ── Flask ──────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-fallback-secret-key")
    FLASK_ENV: str  = os.getenv("FLASK_ENV", "development")
    DEBUG: bool     = FLASK_ENV == "development"
    HOST: str       = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT: int       = int(os.getenv("FLASK_PORT", 5000))

    # ── Database ───────────────────────────────────────────────
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "database/passwords.db")

    # ── bcrypt ─────────────────────────────────────────────────
    BCRYPT_ROUNDS: int = int(os.getenv("BCRYPT_ROUNDS", 12))

    # ── Business rules ─────────────────────────────────────────
    MAX_HISTORY: int = int(os.getenv("MAX_HISTORY", 100))

    # Minimum password length before analysis is even attempted
    MIN_PASSWORD_LENGTH: int = 1
    # Length at which we consider "good length" in the score
    GOOD_LENGTH_THRESHOLD: int = 12

    # Score boundaries  →  strength label
    SCORE_BANDS = [
        (0, 3,  "Weak"),
        (4, 5,  "Medium"),
        (6, 7,  "Strong"),
        (8, 10, "Very Strong"),
    ]
