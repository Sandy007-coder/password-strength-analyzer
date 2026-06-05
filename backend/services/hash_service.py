import hashlib
import hmac
import os

from config import Config


PBKDF2_BASE_ITERATIONS = 50_000
PBKDF2_ITERATIONS = PBKDF2_BASE_ITERATIONS * Config.BCRYPT_ROUNDS
PBKDF2_ALGORITHM = "sha256"
SALT_SIZE_BYTES = 32
DERIVED_KEY_SIZE_BYTES = 32


def hash_password(plain_text: str) -> str:
    """
    Generate a PBKDF2-SHA256 password hash.

    Format:
        pbkdf2$<iterations>$<salt_hex>$<derived_key_hex>
    """
    password_bytes = plain_text.encode("utf-8")
    salt = os.urandom(SALT_SIZE_BYTES)

    derived_key = hashlib.pbkdf2_hmac(
        hash_name=PBKDF2_ALGORITHM,
        password=password_bytes,
        salt=salt,
        iterations=PBKDF2_ITERATIONS,
        dklen=DERIVED_KEY_SIZE_BYTES,
    )

    return (
        f"pbkdf2$"
        f"{PBKDF2_ITERATIONS}$"
        f"{salt.hex()}$"
        f"{derived_key.hex()}"
    )


def verify_password(plain_text: str, stored_hash: str) -> bool:
    """
    Verify a plaintext password against a stored PBKDF2 hash.
    """
    try:
        algorithm, iterations_value, salt_hex, derived_key_hex = (
            stored_hash.split("$")
        )

        iterations = int(iterations_value)
        salt = bytes.fromhex(salt_hex)
        expected_derived_key = bytes.fromhex(derived_key_hex)

        if algorithm != "pbkdf2":
            return False

    except (ValueError, AttributeError):
        return False

    candidate_derived_key = hashlib.pbkdf2_hmac(
        hash_name=PBKDF2_ALGORITHM,
        password=plain_text.encode("utf-8"),
        salt=salt,
        iterations=iterations,
        dklen=len(expected_derived_key),
    )

    return hmac.compare_digest(
        candidate_derived_key,
        expected_derived_key,
    )


def sha256_fingerprint(plain_text: str) -> str:
    """
    Generate a deterministic SHA-256 fingerprint used for
    password reuse detection.
    """
    return hashlib.sha256(
        plain_text.encode("utf-8")
    ).hexdigest()