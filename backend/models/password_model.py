from dataclasses import dataclass
from datetime import datetime


@dataclass(slots=True)
class PasswordRecord:
    bcrypt_hash: str
    sha256_fp: str
    strength: str
    score: int
    entropy: float
    created_at: str = ""
    id: int | None = None

    def __post_init__(self) -> None:
        if not self.created_at:
            self.created_at = f"{datetime.utcnow().isoformat()}Z"

    def to_dict(self) -> dict:
        """
        Return a sanitized representation suitable for API responses.

        Sensitive values such as password hashes and fingerprints are
        intentionally excluded from the returned payload.
        """
        return {
            "id": self.id,
            "strength": self.strength,
            "score": self.score,
            "entropy": self.entropy,
            "created_at": self.created_at,
        }