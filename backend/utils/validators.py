from typing import Any

def validate_password_input(data: Any) -> tuple[bool, str]:

    if not isinstance(data, dict):
        return False, "Request body must be a JSON object."

    if "password" not in data:
        return False, "Missing required field: 'password'."

    password = data["password"]

    if not isinstance(password, str):
        return False, "Field 'password' must be a string."

    if len(password) == 0:
        return False, "Password must not be empty."

    if len(password) > 1000:

        return False, "Password must not exceed 1 000 characters."

    return True, ""
