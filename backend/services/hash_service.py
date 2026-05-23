import hashlib
import hmac
import os
import secrets

from config import Config

# How many PBKDF2 iterations to use.
# Config.BCRYPT_ROUNDS is repurposed as a multiplier:
#   rounds=12  →  600 000 iterations  (production default)
#   rounds=4   →  200 000 iterations  (fast tests)
_BASE_ITERATIONS = 50_000
_ITERATIONS = _BASE_ITERATIONS * Config.BCRYPT_ROUNDS   # 600 000 by default


def hash_password(plain_text: str) -> str:
    """
    Hash a plain-text password using PBKDF2-HMAC-SHA256.

    Returns a string in the format:
        pbkdf2$<iterations>$<salt_hex>$<dk_hex>

    This string is safe to store in the database.
    """
    password_bytes = plain_text.encode("utf-8")
    salt           = os.urandom(32)                       # 256-bit random salt

    dk = hashlib.pbkdf2_hmac(
        hash_name   = "sha256",
        password    = password_bytes,
        salt        = salt,
        iterations  = _ITERATIONS,
        dklen       = 32,                                 # 256-bit derived key
    )

    return f"pbkdf2${_ITERATIONS}${salt.hex()}${dk.hex()}"


def verify_password(plain_text: str, stored_hash: str) -> bool:
    """
    Verify a plain-text password against a stored PBKDF2 hash.

    Returns True if they match, False otherwise.
    Uses hmac.compare_digest to prevent timing attacks.
    """
    try:
        _algo, iterations_str, salt_hex, dk_hex = stored_hash.split("$")
        iterations     = int(iterations_str)
        salt           = bytes.fromhex(salt_hex)
        expected_dk    = bytes.fromhex(dk_hex)
    except (ValueError, AttributeError):
        return False   # malformed stored hash

    password_bytes = plain_text.encode("utf-8")
    candidate_dk = hashlib.pbkdf2_hmac(
        hash_name  = "sha256",
        password   = password_bytes,
        salt       = salt,
        iterations = iterations,
        dklen      = len(expected_dk),
    )

    # Constant-time comparison – prevents timing-based attacks
    return hmac.compare_digest(candidate_dk, expected_dk)


def sha256_fingerprint(plain_text: str) -> str:
    """
    Return a SHA-256 hex digest of the password.

    Used ONLY for fast duplicate/reuse detection in the database.
    NOT used as a standalone password storage mechanism.
    """
    return hashlib.sha256(plain_text.encode("utf-8")).hexdigest()
