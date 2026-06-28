from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass(slots=True)
class PasswordRecord:
    bcrypt_hash: str
    sha256_fp:   str
    strength:    str
    score:       int
    entropy:     float
    id:          int | None = None
    created_at:  str = field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))

    def to_dict(self) -> dict:
        return {
            "id":         self.id,
            "strength":   self.strength,
            "score":      self.score,
            "entropy":    round(self.entropy, 4),
            "created_at": self.created_at,
        }