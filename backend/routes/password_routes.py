from flask import Blueprint, request, jsonify

from utils.validators          import validate_password_input
from services.password_checker import analyse_password
from services.hash_service     import hash_password, sha256_fingerprint
from services.password_generator import generate_strong_password
from database.db               import (
    fingerprint_exists,
    insert_password_record,
    fetch_all_records,
    clear_all_records,
)
from models.password_model     import PasswordRecord


# Create a Blueprint – this groups the routes and lets us register them in app.py
password_bp = Blueprint("password", __name__)


# ── Helpers ────────────────────────────────────────────────────────────────

def _error(message: str, status: int = 400) -> tuple:
    """Return a standardised JSON error response."""
    return jsonify({"success": False, "error": message}), status


def _ok(data: dict, status: int = 200) -> tuple:
    """Return a standardised JSON success response."""
    return jsonify({"success": True, **data}), status


# ══════════════════════════════════════════════════════════════════════════
# 1.  POST /analyze-password
# ══════════════════════════════════════════════════════════════════════════

@password_bp.route("/analyze-password", methods=["POST"])
def analyze_password():
    """
    Analyse a password and return detailed strength feedback.

    Request Body (JSON)
    -------------------
    { "password": "YourP@ssw0rd!" }

    Response (JSON)
    ---------------
    {
      "success": true,
      "strength": "Strong",
      "score": 8,
      "max_score": 10,
      "entropy": 72.45,
      "checks": {
          "length": true,
          "uppercase": true,
          "lowercase": true,
          "numbers": true,
          "special_characters": true,
          "not_common": true
      },
      "suggestions": [],
      "suggested_password": null   ← populated when strength is Weak/Medium
    }
    """
    data = request.get_json(silent=True)
    valid, err = validate_password_input(data)
    if not valid:
        return _error(err)

    password = data["password"]
    result   = analyse_password(password)

    # Suggest a strong alternative when the submitted password is weak
    suggested = None
    if result["strength"] in ("Weak", "Medium"):
        suggested = generate_strong_password(length=16)

    return _ok({**result, "suggested_password": suggested})


# ══════════════════════════════════════════════════════════════════════════
# 2.  POST /save-password
# ══════════════════════════════════════════════════════════════════════════

@password_bp.route("/save-password", methods=["POST"])
def save_password():
    """
    Analyse, hash, and persist a password to the database.

    The plain-text password is NEVER stored.  What gets stored:
      - bcrypt hash (for future verification if needed)
      - SHA-256 fingerprint (for fast reuse detection)
      - Strength metadata (label, score, entropy)

    Returns 409 Conflict if the same password was saved before.

    Request Body (JSON)
    -------------------
    { "password": "YourP@ssw0rd!" }

    Response (JSON)
    ---------------
    {
      "success": true,
      "message": "Password saved successfully.",
      "record_id": 42,
      "strength": "Strong",
      "score": 8,
      "entropy": 72.45
    }
    """
    data = request.get_json(silent=True)
    valid, err = validate_password_input(data)
    if not valid:
        return _error(err)

    password = data["password"]

    # ── Duplicate / reuse check ────────────────────────────────
    fp = sha256_fingerprint(password)
    if fingerprint_exists(fp):
        return _error(
            "This password has already been saved. "
            "Please choose a different password to avoid reuse.",
            status=409,
        )

    # ── Analyse ────────────────────────────────────────────────
    result = analyse_password(password)

    # ── Hash ───────────────────────────────────────────────────
    bh = hash_password(password)  # bcrypt hash (slow but safe)

    # ── Persist ────────────────────────────────────────────────
    record = PasswordRecord(
        bcrypt_hash=bh,
        sha256_fp=fp,
        strength=result["strength"],
        score=result["score"],
        entropy=result["entropy"],
    )
    new_id = insert_password_record(record)

    return _ok(
        {
            "message":   "Password saved successfully.",
            "record_id": new_id,
            "strength":  result["strength"],
            "score":     result["score"],
            "entropy":   result["entropy"],
        },
        status=201,
    )


# ══════════════════════════════════════════════════════════════════════════
# 3.  GET /password-history
# ══════════════════════════════════════════════════════════════════════════

@password_bp.route("/password-history", methods=["GET"])
def password_history():
    """
    Return a list of previously saved password records (metadata only).
    Plain-text passwords and hashes are NEVER returned.

    Response (JSON)
    ---------------
    {
      "success": true,
      "count": 3,
      "history": [
        { "id": 3, "strength": "Strong", "score": 8, "entropy": 72.45, "created_at": "2024-..." },
        ...
      ]
    }
    """
    records = fetch_all_records()
    return _ok({"count": len(records), "history": records})


# ══════════════════════════════════════════════════════════════════════════
# 4.  DELETE /clear-history
# ══════════════════════════════════════════════════════════════════════════

@password_bp.route("/clear-history", methods=["DELETE"])
def clear_history():
    """
    Permanently delete all stored password records.

    Response (JSON)
    ---------------
    {
      "success": true,
      "message": "History cleared.",
      "deleted_count": 5
    }
    """
    deleted = clear_all_records()
    return _ok({"message": "History cleared.", "deleted_count": deleted})


# ══════════════════════════════════════════════════════════════════════════
# Health-check (bonus – useful for Docker / load-balancer probes)
# ══════════════════════════════════════════════════════════════════════════

@password_bp.route("/health", methods=["GET"])
def health():
    """Simple liveness probe."""
    return _ok({"status": "healthy"})
