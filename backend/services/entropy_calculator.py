import math
import re

_LOWER   = re.compile(r"[a-z]")
_UPPER   = re.compile(r"[A-Z]")
_DIGIT   = re.compile(r"[0-9]")
_SPECIAL = re.compile(r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]")
_NON_ASCII = re.compile(r"[^\x00-\x7F]")

_THRESHOLDS = (
    (28,  "Very Weak"),
    (36,  "Weak"),
    (60,  "Reasonable"),
    (128, "Strong"),
)


def _character_pool(password: str) -> int:
    pool = 0
    if _LOWER.search(password):     pool += 26
    if _UPPER.search(password):     pool += 26
    if _DIGIT.search(password):     pool += 10
    if _SPECIAL.search(password):   pool += 32
    if _NON_ASCII.search(password): pool += 64
    return pool or 26


def calculate_entropy(password: str) -> float:
    if not password:
        return 0.0
    return round(len(password) * math.log2(_character_pool(password)), 2)


def entropy_label(entropy: float) -> str:
    for threshold, label in _THRESHOLDS:
        if entropy < threshold:
            return label
    return "Very Strong"