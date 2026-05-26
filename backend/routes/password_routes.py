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


password_bp = Blueprint("password", __name__)


# Helpers

def _error(message: str, status: int = 400) -> tuple:
    
    return jsonify({"success": False, "error": message}), status


def _ok(data: dict, status: int = 200) -> tuple:
  
    return jsonify({"success": True, **data}), status



@password_bp.route("/analyze-password", methods=["POST"])
def analyze_password():

    data = request.get_json(silent=True)
    valid, err = validate_password_input(data)
    if not valid:
        return _error(err)

    password = data["password"]
    result   = analyse_password(password)

    suggested = None
    if result["strength"] in ("Weak", "Medium"):
        suggested = generate_strong_password(length=16)

    return _ok({**result, "suggested_password": suggested})


@password_bp.route("/save-password", methods=["POST"])
def save_password():

    data = request.get_json(silent=True)
    valid, err = validate_password_input(data)
    if not valid:
        return _error(err)

    password = data["password"]

    
    fp = sha256_fingerprint(password)
    if fingerprint_exists(fp):
        return _error(
            "This password has already been saved. "
            "Please choose a different password to avoid reuse.",
            status=409,
        )

   
    result = analyse_password(password)

    bh = hash_password(password)  

  
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


@password_bp.route("/password-history", methods=["GET"])
def password_history():

    records = fetch_all_records()
    return _ok({"count": len(records), "history": records})


@password_bp.route("/clear-history", methods=["DELETE"])
def clear_history():

    deleted = clear_all_records()
    return _ok({"message": "History cleared.", "deleted_count": deleted})


@password_bp.route("/health", methods=["GET"])
def health():
  
    return _ok({"status": "healthy"})
