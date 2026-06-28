import logging

from flask import Blueprint, jsonify, request

from database.db import (
    clear_all_records,
    fetch_all_records,
    fingerprint_exists,
    insert_password_record,
)
from models.password_model import PasswordRecord
from services.hash_service import hash_password, sha256_fingerprint
from services.password_checker import analyse_password
from services.password_generator import generate_strong_password
from utils.validators import validate_password_input

logger = logging.getLogger(__name__)

password_bp = Blueprint("password", __name__)

_WEAK_STRENGTHS = {"Weak", "Medium"}


def _error(message: str, status: int = 400):
    return jsonify({"success": False, "error": message}), status


def _ok(payload: dict, status: int = 200):
    return jsonify({"success": True, **payload}), status


@password_bp.route("/analyze-password", methods=["POST"])
def analyze_password():
    body = request.get_json(silent=True)

    ok, err = validate_password_input(body)
    if not ok:
        return _error(err)

    password = body["password"]
    analysis  = analyse_password(password)

    suggestion = (
        generate_strong_password(length=16)
        if analysis["strength"] in _WEAK_STRENGTHS
        else None
    )

    logger.info("Password analysed — strength=%s score=%d", analysis["strength"], analysis["score"])

    return _ok({**analysis, "suggested_password": suggestion})


@password_bp.route("/save-password", methods=["POST"])
def save_password():
    body = request.get_json(silent=True)

    ok, err = validate_password_input(body)
    if not ok:
        return _error(err)

    password    = body["password"]
    fingerprint = sha256_fingerprint(password)

    if fingerprint_exists(fingerprint):
        return _error(
            "This password has already been saved. Choose a different password to avoid reuse.",
            status=409,
        )

    analysis = analyse_password(password)
    record   = PasswordRecord(
        bcrypt_hash=hash_password(password),
        sha256_fp=fingerprint,
        strength=analysis["strength"],
        score=analysis["score"],
        entropy=analysis["entropy"],
    )

    record_id = insert_password_record(record)
    logger.info("Password record saved — id=%d strength=%s", record_id, record.strength)

    return _ok(
        {
            "message":   "Password saved successfully.",
            "record_id": record_id,
            "strength":  analysis["strength"],
            "score":     analysis["score"],
            "entropy":   analysis["entropy"],
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
    logger.info("Password history cleared — %d record(s) removed.", deleted)
    return _ok({"message": "History cleared.", "deleted_count": deleted})


@password_bp.route("/health", methods=["GET"])
def health():
    return _ok({"status": "healthy"})