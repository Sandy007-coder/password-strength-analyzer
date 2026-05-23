import re
from config import Config
from services.entropy_calculator import calculate_entropy
from utils.common_passwords import is_common_password


#  Scoring weights 
# Each rule contributes a fixed number of points to the total score.
# Max possible score = 10.
SCORE_MAP = {
    "min_length":         1,   # at least 8 characters
    "good_length":        1,   # at least 12 characters
    "extra_length":       1,   # at least 16 characters
    "uppercase":          1,   # at least one A–Z
    "lowercase":          1,   # at least one a–z
    "numbers":            1,   # at least one 0–9
    "special_characters": 1,   # at least one symbol
    "no_common":          1,   # not in common-password list
    "high_entropy":       1,   # entropy ≥ 60 bits
    "very_high_entropy":  1,   # entropy ≥ 80 bits
}


def _check_rules(password: str) -> dict:
    """
    Run every individual rule and return a dict of booleans.
    True = the password satisfies that rule.
    """
    length  = len(password)
    entropy = calculate_entropy(password)

    return {
        # Length rules
        "min_length":         length >= 8,
        "good_length":        length >= Config.GOOD_LENGTH_THRESHOLD,
        "extra_length":       length >= 16,
        # Character-class rules
        "uppercase":          bool(re.search(r"[A-Z]", password)),
        "lowercase":          bool(re.search(r"[a-z]", password)),
        "numbers":            bool(re.search(r"[0-9]", password)),
        "special_characters": bool(re.search(
            r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]", password
        )),
        # Safety rules
        "no_common":          not is_common_password(password),
        # Entropy rules
        "high_entropy":       entropy >= 60,
        "very_high_entropy":  entropy >= 80,
    }


def _calculate_score(rules: dict) -> int:
    """Sum up the score based on which rules passed."""
    return sum(SCORE_MAP[rule] for rule, passed in rules.items() if passed)


def _strength_label(score: int) -> str:
    """Map a numeric score to a human-readable strength label."""
    for low, high, label in Config.SCORE_BANDS:
        if low <= score <= high:
            return label
    return "Very Strong"   # score > 8 fallback


def _build_suggestions(password: str, rules: dict) -> list[str]:
    """
    Return a list of actionable improvement suggestions.
    Only suggestions for *failed* rules are included.
    If the password is already great, the list is empty.
    """
    suggestions = []

    if is_common_password(password):
        suggestions.append(
            "This password appears in common password lists and can be cracked instantly. "
            "Choose something completely different."
        )
        # If it's common, most other suggestions are moot – return early.
        return suggestions

    if not rules["min_length"]:
        suggestions.append("Use at least 8 characters.")

    if not rules["good_length"]:
        suggestions.append("Aim for at least 12 characters for better security.")
    elif not rules["extra_length"]:
        suggestions.append("Consider 16+ characters for maximum security.")

    if not rules["uppercase"]:
        suggestions.append("Add at least one uppercase letter (A–Z).")

    if not rules["lowercase"]:
        suggestions.append("Add at least one lowercase letter (a–z).")

    if not rules["numbers"]:
        suggestions.append("Add at least one number (0–9).")

    if not rules["special_characters"]:
        suggestions.append(
            "Add at least one special character (e.g. ! @ # $ % ^ & *)."
        )

    if not rules["high_entropy"]:
        suggestions.append(
            "Increase password complexity – mix more character types or use a longer phrase."
        )

    return suggestions


def analyse_password(password: str) -> dict:
    """
    Run the full analysis pipeline and return a structured result.

    Parameters
    ----------
    password : str
        The raw (un-hashed) password to analyse.

    Returns
    -------
    dict with keys:
        strength    – "Weak" | "Medium" | "Strong" | "Very Strong"
        score       – integer 0–10
        entropy     – float (bits)
        checks      – dict of individual rule results (booleans)
        suggestions – list of improvement strings (empty if strong)
    """
    rules       = _check_rules(password)
    score       = _calculate_score(rules)
    entropy     = calculate_entropy(password)
    strength    = _strength_label(score)
    suggestions = _build_suggestions(password, rules)

    # Public-facing checks (subset of internal rules, matching API spec)
    public_checks = {
        "length":            rules["min_length"],
        "uppercase":         rules["uppercase"],
        "lowercase":         rules["lowercase"],
        "numbers":           rules["numbers"],
        "special_characters": rules["special_characters"],
        "not_common":        rules["no_common"],
    }

    return {
        "strength":    strength,
        "score":       score,
        "max_score":   len(SCORE_MAP),
        "entropy":     entropy,
        "checks":      public_checks,
        "suggestions": suggestions,
    }
