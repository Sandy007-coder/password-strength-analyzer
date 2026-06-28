from typing import Any

_MAX_LEN = 1000


def validate_password_input(payload: Any) -> tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "Request body must be a JSON object."
    if "password" not in payload:
        return False, "Missing required field: 'password'."

    password = payload["password"]

    if not isinstance(password, str):
        return False, "Field 'password' must be a string."
    if not password.strip():
        return False, "Password must not be empty or blank."
    if len(password) > _MAX_LEN:
        return False, f"Password must not exceed {_MAX_LEN:,} characters."

    return True, ""