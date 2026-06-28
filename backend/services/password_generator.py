import secrets
import string

_UPPER   = string.ascii_uppercase
_LOWER   = string.ascii_lowercase
_DIGITS  = string.digits
_SPECIAL = "!@#$%^&*()-_=+[]{}|;:,.<>?"
_POOL    = _UPPER + _LOWER + _DIGITS + _SPECIAL

_MIN_LEN = 12
_MAX_LEN = 128


def generate_strong_password(length: int = 16) -> str:
    length = max(_MIN_LEN, min(length, _MAX_LEN))

    chars = [
        secrets.choice(_UPPER),
        secrets.choice(_LOWER),
        secrets.choice(_DIGITS),
        secrets.choice(_SPECIAL),
        *[secrets.choice(_POOL) for _ in range(length - 4)],
    ]

    for i in range(len(chars) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        chars[i], chars[j] = chars[j], chars[i]

    return "".join(chars)