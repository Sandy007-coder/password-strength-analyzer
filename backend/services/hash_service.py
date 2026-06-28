import hashlib
import hmac
import logging
import os

from config import Config

logger = logging.getLogger(__name__)

_ALGORITHM       = "sha256"
_ITERATIONS      = 50_000 * Config.BCRYPT_ROUNDS
_SALT_BYTES      = 32
_DK_BYTES        = 32
_HASH_PREFIX     = "pbkdf2"


def hash_password(plaintext: str) -> str:
    salt = os.urandom(_SALT_BYTES)
    dk   = hashlib.pbkdf2_hmac(_ALGORITHM, plaintext.encode(), salt, _ITERATIONS, _DK_BYTES)
    return f"{_HASH_PREFIX}${_ITERATIONS}${salt.hex()}${dk.hex()}"


def verify_password(plaintext: str, stored: str) -> bool:
    try:
        prefix, iter_str, salt_hex, dk_hex = stored.split("$")
        if prefix != _HASH_PREFIX:
            return False
        iterations = int(iter_str)
        salt       = bytes.fromhex(salt_hex)
        expected   = bytes.fromhex(dk_hex)
    except (ValueError, AttributeError):
        logger.warning("Malformed hash presented for verification.")
        return False

    candidate = hashlib.pbkdf2_hmac(
        _ALGORITHM,
        plaintext.encode(),
        salt,
        iterations,
        len(expected),
    )
    return hmac.compare_digest(candidate, expected)


def sha256_fingerprint(plaintext: str) -> str:
    return hashlib.sha256(plaintext.encode()).hexdigest()