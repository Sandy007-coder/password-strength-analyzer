import math
import re


LOWERCASE_PATTERN = re.compile(r"[a-z]")
UPPERCASE_PATTERN = re.compile(r"[A-Z]")
DIGIT_PATTERN = re.compile(r"[0-9]")
SPECIAL_CHARACTER_PATTERN = re.compile(
    r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]"
)
NON_ASCII_PATTERN = re.compile(r"[^\x00-\x7F]")


def _estimate_character_pool(password: str) -> int:
    """
    Estimate the effective character pool used by the password.
    """
    pool_size = 0

    if LOWERCASE_PATTERN.search(password):
        pool_size += 26

    if UPPERCASE_PATTERN.search(password):
        pool_size += 26

    if DIGIT_PATTERN.search(password):
        pool_size += 10

    if SPECIAL_CHARACTER_PATTERN.search(password):
        pool_size += 32

    if NON_ASCII_PATTERN.search(password):
        pool_size += 64

    return pool_size or 26


def calculate_entropy(password: str) -> float:
    """
    Calculate password entropy in bits.
    """
    if not password:
        return 0.0

    character_pool_size = _estimate_character_pool(password)
    password_length = len(password)

    entropy_bits = password_length * math.log2(character_pool_size)

    return round(entropy_bits, 2)


def entropy_label(entropy: float) -> str:
    """
    Convert entropy value into a human-readable strength category.
    """
    if entropy < 28:
        return "Very Weak"

    if entropy < 36:
        return "Weak"

    if entropy < 60:
        return "Reasonable"

    if entropy < 128:
        return "Strong"

    return "Very Strong"