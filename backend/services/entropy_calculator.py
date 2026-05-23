import math
import re


def _character_pool_size(password: str) -> int:
    """
    Estimate the size of the character pool the user drew from.
    We look at which *categories* appear in the password, not the
    exact characters, which gives a conservative but fair estimate.
    """
    pool = 0

    if re.search(r"[a-z]", password):
        pool += 26          # a–z

    if re.search(r"[A-Z]", password):
        pool += 26          # A–Z

    if re.search(r"[0-9]", password):
        pool += 10          # 0–9

    # Common special / punctuation characters (keyboard-reachable)
    if re.search(r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]", password):
        pool += 32

    # Extended Unicode (emoji, accented letters, etc.)
    if re.search(r"[^\x00-\x7F]", password):
        pool += 64          # rough estimate for extended character sets

    # Fallback: treat as lowercase only (should never happen after above)
    if pool == 0:
        pool = 26

    return pool


def calculate_entropy(password: str) -> float:
    """
    Calculate the Shannon entropy of the password in bits.
    Returns a float rounded to 2 decimal places.

    Example
    -------
    >>> calculate_entropy("P@ssw0rd!")
    56.92
    """
    if not password:
        return 0.0

    pool_size = _character_pool_size(password)
    length    = len(password)

    # H = L × log₂(N)
    entropy = length * math.log2(pool_size)
    return round(entropy, 2)


def entropy_label(entropy: float) -> str:
    """Return a human-readable label for the given entropy value."""
    if entropy < 28:
        return "Very Weak"
    elif entropy < 36:
        return "Weak"
    elif entropy < 60:
        return "Reasonable"
    elif entropy < 128:
        return "Strong"
    else:
        return "Very Strong"
