import math
import re

def _character_pool_size(password: str) -> int:
   
    pool = 0

    if re.search(r"[a-z]", password):
        pool += 26          # a–z

    if re.search(r"[A-Z]", password):
        pool += 26          # A–Z

    if re.search(r"[0-9]", password):
        pool += 10          # 0–9

    if re.search(r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]", password):
        pool += 32

    if re.search(r"[^\x00-\x7F]", password):
        pool += 64         

    if pool == 0:
        pool = 26

    return pool


def calculate_entropy(password: str) -> float:

    if not password:
        return 0.0

    pool_size = _character_pool_size(password)
    length    = len(password)

    entropy = length * math.log2(pool_size)
    return round(entropy, 2)


def entropy_label(entropy: float) -> str:
   
    if entropy < 28:
        return "Very Weak"
    elif entropy < 36:
        return "Weak"
    elif entropy < 60:
        return "Reasonable"
    elif entropy < 128:
        return "Strong"
    else:
        return "Very Strong"
