from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class PasswordRecord:

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
       
        return {
            "id":         self.id,
            "strength":   self.strength,
            "score":      self.score,
            "entropy":    self.entropy,
            "created_at": self.created_at,
            # Never expose bcrypt_hash or sha256_fp in API responses
        }
