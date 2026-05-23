from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class PasswordRecord:
    """
    Represents one row in the `password_history` table.

    Attributes
    ----------
    id           : int | None   Row primary key (None before insert).
    bcrypt_hash  : str          bcrypt hash of the password.
    sha256_fp    : str          SHA-256 fingerprint for reuse detection.
    strength     : str          "Weak" | "Medium" | "Strong" | "Very Strong"
    score        : int          Numeric score 0–10.
    entropy      : float        Entropy in bits.
    created_at   : str          ISO-8601 timestamp (UTC).
    """
    bcrypt_hash: str
    sha256_fp:   str
    strength:    str
    score:       int
    entropy:     float
    created_at:  str = ""
    id:          int | None = None

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.utcnow().isoformat() + "Z"

    def to_dict(self) -> dict:
        """Convert to a JSON-serialisable dict (excludes sensitive hashes)."""
        return {
            "id":         self.id,
            "strength":   self.strength,
            "score":      self.score,
            "entropy":    self.entropy,
            "created_at": self.created_at,
            # Never expose bcrypt_hash or sha256_fp in API responses
        }
