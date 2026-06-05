import re

from config import Config
from services.entropy_calculator import calculate_entropy
from utils.common_passwords import is_common_password


UPPERCASE_PATTERN = re.compile(r"[A-Z]")
LOWERCASE_PATTERN = re.compile(r"[a-z]")
DIGIT_PATTERN = re.compile(r"[0-9]")
SPECIAL_CHARACTER_PATTERN = re.compile(
    r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]"
)

PASSWORD_SCORING_RULES = {
    "min_length": 1,
    "good_length": 1,
    "extra_length": 1,
    "uppercase": 1,
    "lowercase": 1,
    "numbers": 1,
    "special_characters": 1,
    "no_common": 1,
    "high_entropy": 1,
    "very_high_entropy": 1,
}


def _evaluate_password_rules(password: str) -> dict[str, bool]:
    """
    Evaluate all password quality rules used for scoring.
    """
    password_length = len(password)
    entropy_score = calculate_entropy(password)

    return {
        "min_length": password_length >= 8,
        "good_length": password_length >= Config.GOOD_LENGTH_THRESHOLD,
        "extra_length": password_length >= 16,
        "uppercase": bool(UPPERCASE_PATTERN.search(password)),
        "lowercase": bool(LOWERCASE_PATTERN.search(password)),
        "numbers": bool(DIGIT_PATTERN.search(password)),
        "special_characters": bool(
            SPECIAL_CHARACTER_PATTERN.search(password)
        ),
        "no_common": not is_common_password(password),
        "high_entropy": entropy_score >= 60,
        "very_high_entropy": entropy_score >= 80,
    }


def _calculate_score(rule_results: dict[str, bool]) -> int:
    """
    Calculate the total password score based on passed rules.
    """
    return sum(
        PASSWORD_SCORING_RULES[rule_name]
        for rule_name, passed in rule_results.items()
        if passed
    )


def _resolve_strength_label(score: int) -> str:
    """
    Map a numeric score to a configured strength label.
    """
    for minimum_score, maximum_score, label in Config.SCORE_BANDS:
        if minimum_score <= score <= maximum_score:
            return label

    return "Very Strong"


def _generate_improvement_suggestions(
    password: str,
    rule_results: dict[str, bool],
) -> list[str]:
    """
    Generate actionable recommendations to improve password strength.
    """
    recommendations: list[str] = []

    if is_common_password(password):
        recommendations.append(
            "This password appears in common password lists and can be "
            "cracked instantly. Choose something completely different."
        )
        return recommendations

    if not rule_results["min_length"]:
        recommendations.append("Use at least 8 characters.")

    if not rule_results["good_length"]:
        recommendations.append(
            "Aim for at least 12 characters for better security."
        )
    elif not rule_results["extra_length"]:
        recommendations.append(
            "Consider 16+ characters for maximum security."
        )

    if not rule_results["uppercase"]:
        recommendations.append(
            "Add at least one uppercase letter (A–Z)."
        )

    if not rule_results["lowercase"]:
        recommendations.append(
            "Add at least one lowercase letter (a–z)."
        )

    if not rule_results["numbers"]:
        recommendations.append(
            "Add at least one number (0–9)."
        )

    if not rule_results["special_characters"]:
        recommendations.append(
            "Add at least one special character "
            "(e.g. ! @ # $ % ^ & *)."
        )

    if not rule_results["high_entropy"]:
        recommendations.append(
            "Increase password complexity – mix more character "
            "types or use a longer phrase."
        )

    return recommendations


def analyse_password(password: str) -> dict:
    """
    Analyze password strength and return a structured assessment.
    """
    rule_results = _evaluate_password_rules(password)

    score = _calculate_score(rule_results)
    entropy = calculate_entropy(password)
    strength = _resolve_strength_label(score)

    suggestions = _generate_improvement_suggestions(
        password=password,
        rule_results=rule_results,
    )

    public_checks = {
        "length": rule_results["min_length"],
        "uppercase": rule_results["uppercase"],
        "lowercase": rule_results["lowercase"],
        "numbers": rule_results["numbers"],
        "special_characters": rule_results["special_characters"],
        "not_common": rule_results["no_common"],
    }

    return {
        "strength": strength,
        "score": score,
        "max_score": len(PASSWORD_SCORING_RULES),
        "entropy": entropy,
        "checks": public_checks,
        "suggestions": suggestions,
    }