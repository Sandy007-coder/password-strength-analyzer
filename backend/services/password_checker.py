import re

from config import Config
from services.entropy_calculator import calculate_entropy
from utils.common_passwords import is_common_password

_UPPER   = re.compile(r"[A-Z]")
_LOWER   = re.compile(r"[a-z]")
_DIGIT   = re.compile(r"[0-9]")
_SPECIAL = re.compile(r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]")

_RULES = (
    "min_length", "good_length", "extra_length",
    "uppercase", "lowercase", "numbers", "special_characters",
    "no_common", "high_entropy", "very_high_entropy",
)
MAX_SCORE = len(_RULES)


def _evaluate_rules(password: str) -> dict[str, bool]:
    length  = len(password)
    entropy = calculate_entropy(password)

    return {
        "min_length":        length >= 8,
        "good_length":       length >= Config.GOOD_LENGTH_THRESHOLD,
        "extra_length":      length >= 16,
        "uppercase":         bool(_UPPER.search(password)),
        "lowercase":         bool(_LOWER.search(password)),
        "numbers":           bool(_DIGIT.search(password)),
        "special_characters": bool(_SPECIAL.search(password)),
        "no_common":         not is_common_password(password),
        "high_entropy":      entropy >= 60,
        "very_high_entropy": entropy >= 80,
    }


def _score(rules: dict[str, bool]) -> int:
    return sum(1 for passed in rules.values() if passed)


def _strength_label(score: int) -> str:
    for low, high, label in Config.SCORE_BANDS:
        if low <= score <= high:
            return label
    return "Very Strong"


def _suggestions(password: str, rules: dict[str, bool]) -> list[str]:
    if is_common_password(password):
        return [
            "This password appears in common breach lists and can be cracked instantly. "
            "Choose something completely different."
        ]

    tips = []

    if not rules["min_length"]:
        tips.append("Use at least 8 characters.")
    elif not rules["good_length"]:
        tips.append("Aim for at least 12 characters for better security.")
    elif not rules["extra_length"]:
        tips.append("Consider 16+ characters for maximum protection.")

    if not rules["uppercase"]:
        tips.append("Add at least one uppercase letter (A–Z).")
    if not rules["lowercase"]:
        tips.append("Add at least one lowercase letter (a–z).")
    if not rules["numbers"]:
        tips.append("Add at least one number (0–9).")
    if not rules["special_characters"]:
        tips.append("Add at least one special character (e.g. ! @ # $ % ^ & *).")
    if not rules["high_entropy"]:
        tips.append("Increase complexity — mix more character types or use a longer passphrase.")

    return tips


def analyse_password(password: str) -> dict:
    rules    = _evaluate_rules(password)
    score    = _score(rules)
    entropy  = calculate_entropy(password)
    strength = _strength_label(score)

    return {
        "strength":  strength,
        "score":     score,
        "max_score": MAX_SCORE,
        "entropy":   entropy,
        "checks": {
            "length":            rules["min_length"],
            "uppercase":         rules["uppercase"],
            "lowercase":         rules["lowercase"],
            "numbers":           rules["numbers"],
            "special_characters": rules["special_characters"],
            "not_common":        rules["no_common"],
        },
        "suggestions": _suggestions(password, rules),
    }