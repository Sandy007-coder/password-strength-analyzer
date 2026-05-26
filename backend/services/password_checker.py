import re
from config import Config
from services.entropy_calculator import calculate_entropy
from utils.common_passwords import is_common_password

SCORE_MAP = {
    "min_length":         1,   
    "good_length":        1,   
    "extra_length":       1,   
    "uppercase":          1,   
    "lowercase":          1,   
    "numbers":            1,   
    "special_characters": 1,   
    "no_common":          1,  
    "high_entropy":       1,   
    "very_high_entropy":  1,   
}


def _check_rules(password: str) -> dict:
 
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
    
    return sum(SCORE_MAP[rule] for rule, passed in rules.items() if passed)


def _strength_label(score: int) -> str:
   
    for low, high, label in Config.SCORE_BANDS:
        if low <= score <= high:
            return label
    return "Very Strong"  


def _build_suggestions(password: str, rules: dict) -> list[str]:

    suggestions = []

    if is_common_password(password):
        suggestions.append(
            "This password appears in common password lists and can be cracked instantly. "
            "Choose something completely different."
        )
       
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

    rules       = _check_rules(password)
    score       = _calculate_score(rules)
    entropy     = calculate_entropy(password)
    strength    = _strength_label(score)
    suggestions = _build_suggestions(password, rules)

    
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
