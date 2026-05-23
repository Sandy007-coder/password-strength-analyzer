import secrets
import string


# Full printable ASCII excluding space (space causes copy-paste headaches)
_LETTERS_UPPER  = string.ascii_uppercase          # A–Z
_LETTERS_LOWER  = string.ascii_lowercase          # a–z
_DIGITS         = string.digits                   # 0–9
_SPECIAL        = "!@#$%^&*()-_=+[]{}|;:,.<>?"   # curated safe symbols
_ALL_CHARS      = _LETTERS_UPPER + _LETTERS_LOWER + _DIGITS + _SPECIAL


def generate_strong_password(length: int = 16) -> str:
    """
    Generate a cryptographically strong random password.

    Guarantees at least one character from each required category
    before filling the rest randomly, then shuffles the result.

    Parameters
    ----------
    length : int
        Desired password length (minimum 12, capped at 128).

    Returns
    -------
    str
        A random password of the requested length.
    """
    length = max(12, min(length, 128))   # clamp to [12, 128]

    # Seed with one guaranteed character from each category
    mandatory = [
        secrets.choice(_LETTERS_UPPER),
        secrets.choice(_LETTERS_LOWER),
        secrets.choice(_DIGITS),
        secrets.choice(_SPECIAL),
    ]

    # Fill the rest from the full pool
    remainder = [secrets.choice(_ALL_CHARS) for _ in range(length - len(mandatory))]

    password_list = mandatory + remainder

    # Shuffle in-place using the CSPRNG
    for i in range(len(password_list) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        password_list[i], password_list[j] = password_list[j], password_list[i]

    return "".join(password_list)
