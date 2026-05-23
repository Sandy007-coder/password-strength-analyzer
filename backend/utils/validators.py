from typing import Any


def validate_password_input(data: Any) -> tuple[bool, str]:
    """
    Validate that the request body contains a usable 'password' field.

    Returns
    -------
    (True, "")              – input is valid; proceed.
    (False, "error message") – input is invalid; return 400 to caller.
    """
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
        # Hard upper limit to prevent DoS via enormous bcrypt inputs.
        # bcrypt silently truncates input at 72 bytes, so anything larger
        # is either a bug or an attack.
        return False, "Password must not exceed 1 000 characters."

    return True, ""
