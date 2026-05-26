import secrets
import string

_LETTERS_UPPER  = string.ascii_uppercase         
_LETTERS_LOWER  = string.ascii_lowercase          
_DIGITS         = string.digits                  
_SPECIAL        = "!@#$%^&*()-_=+[]{}|;:,.<>?"   
_ALL_CHARS      = _LETTERS_UPPER + _LETTERS_LOWER + _DIGITS + _SPECIAL


def generate_strong_password(length: int = 16) -> str:

    length = max(12, min(length, 128))   

    mandatory = [
        secrets.choice(_LETTERS_UPPER),
        secrets.choice(_LETTERS_LOWER),
        secrets.choice(_DIGITS),
        secrets.choice(_SPECIAL),
    ]

    remainder = [secrets.choice(_ALL_CHARS) for _ in range(length - len(mandatory))]

    password_list = mandatory + remainder

    for i in range(len(password_list) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        password_list[i], password_list[j] = password_list[j], password_list[i]

    return "".join(password_list)
