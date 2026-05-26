import hashlib
import hmac
import os
import secrets

from config import Config

_BASE_ITERATIONS = 50_000
_ITERATIONS = _BASE_ITERATIONS * Config.BCRYPT_ROUNDS   


def hash_password(plain_text: str) -> str:

    password_bytes = plain_text.encode("utf-8")
    salt           = os.urandom(32)                       

    dk = hashlib.pbkdf2_hmac(
        hash_name   = "sha256",
        password    = password_bytes,
        salt        = salt,
        iterations  = _ITERATIONS,
        dklen       = 32,                                 
    )

    return f"pbkdf2${_ITERATIONS}${salt.hex()}${dk.hex()}"


def verify_password(plain_text: str, stored_hash: str) -> bool:

    try:
        _algo, iterations_str, salt_hex, dk_hex = stored_hash.split("$")
        iterations     = int(iterations_str)
        salt           = bytes.fromhex(salt_hex)
        expected_dk    = bytes.fromhex(dk_hex)
    except (ValueError, AttributeError):
        return False  

    password_bytes = plain_text.encode("utf-8")
    candidate_dk = hashlib.pbkdf2_hmac(
        hash_name  = "sha256",
        password   = password_bytes,
        salt       = salt,
        iterations = iterations,
        dklen      = len(expected_dk),
    )

    
    return hmac.compare_digest(candidate_dk, expected_dk)


def sha256_fingerprint(plain_text: str) -> str:
 
    return hashlib.sha256(plain_text.encode("utf-8")).hexdigest()
