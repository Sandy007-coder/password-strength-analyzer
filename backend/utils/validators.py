from typing import Any


MAX_PASSWORD_LENGTH = 1000


def validate_password_input(payload: Any) -> tuple[bool, str]:
    """
    Validate the request payload used by password-related endpoints.
    """
    if not isinstance(payload, dict):
        return False, "Request body must be a JSON object."

    if "password" not in payload:
        return False, "Missing required field: 'password'."

    password = payload["password"]

    if not isinstance(password, str):
        return False, "Field 'password' must be a string."

    if not password:
        return False, "Password must not be empty."

    if len(password) > MAX_PASSWORD_LENGTH:
        return (
            False,
            f"Password must not exceed {MAX_PASSWORD_LENGTH:,} characters.",
        )

    return True, ""