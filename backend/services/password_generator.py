import secrets
import string


UPPERCASE_CHARACTERS = string.ascii_uppercase
LOWERCASE_CHARACTERS = string.ascii_lowercase
NUMERIC_CHARACTERS = string.digits
SPECIAL_CHARACTERS = "!@#$%^&*()-_=+[]{}|;:,.<>?"

PASSWORD_CHARACTER_SET = (
    UPPERCASE_CHARACTERS
    + LOWERCASE_CHARACTERS
    + NUMERIC_CHARACTERS
    + SPECIAL_CHARACTERS
)

MIN_PASSWORD_LENGTH = 12
MAX_PASSWORD_LENGTH = 128


def generate_strong_password(length: int = 16) -> str:
    """
    Generate a cryptographically secure password containing at least one
    uppercase letter, lowercase letter, digit, and special character.
    """
    password_length = max(
        MIN_PASSWORD_LENGTH,
        min(length, MAX_PASSWORD_LENGTH),
    )

    required_characters = [
        secrets.choice(UPPERCASE_CHARACTERS),
        secrets.choice(LOWERCASE_CHARACTERS),
        secrets.choice(NUMERIC_CHARACTERS),
        secrets.choice(SPECIAL_CHARACTERS),
    ]

    random_characters = [
        secrets.choice(PASSWORD_CHARACTER_SET)
        for _ in range(password_length - len(required_characters))
    ]

    password_characters = required_characters + random_characters

    # Fisher-Yates shuffle using a cryptographically secure RNG.
    for current_index in range(len(password_characters) - 1, 0, -1):
        random_index = secrets.randbelow(current_index + 1)

        password_characters[current_index], password_characters[random_index] = (
            password_characters[random_index],
            password_characters[current_index],
        )

    return "".join(password_characters)