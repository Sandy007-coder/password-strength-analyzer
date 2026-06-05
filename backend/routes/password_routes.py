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


password_bp = Blueprint("password", __name__)


def build_error_response(message: str, status_code: int = 400) -> tuple:
    return jsonify(
        {
            "success": False,
            "error": message,
        }
    ), status_code


def build_success_response(
    payload: dict,
    status_code: int = 200,
) -> tuple:
    return jsonify(
        {
            "success": True,
            **payload,
        }
    ), status_code


@password_bp.route("/analyze-password", methods=["POST"])
def analyze_password():
    request_payload = request.get_json(silent=True)

    is_valid, validation_error = validate_password_input(request_payload)
    if not is_valid:
        return build_error_response(validation_error)

    password = request_payload["password"]
    analysis_result = analyse_password(password)

    suggested_password = None
    if analysis_result["strength"] in {"Weak", "Medium"}:
        suggested_password = generate_strong_password(length=16)

    return build_success_response(
        {
            **analysis_result,
            "suggested_password": suggested_password,
        }
    )


@password_bp.route("/save-password", methods=["POST"])
def save_password():
    request_payload = request.get_json(silent=True)

    is_valid, validation_error = validate_password_input(request_payload)
    if not is_valid:
        return build_error_response(validation_error)

    password = request_payload["password"]

    password_fingerprint = sha256_fingerprint(password)

    if fingerprint_exists(password_fingerprint):
        return build_error_response(
            (
                "This password has already been saved. "
                "Please choose a different password to avoid reuse."
            ),
            status_code=409,
        )

    analysis_result = analyse_password(password)
    password_hash = hash_password(password)

    password_record = PasswordRecord(
        bcrypt_hash=password_hash,
        sha256_fp=password_fingerprint,
        strength=analysis_result["strength"],
        score=analysis_result["score"],
        entropy=analysis_result["entropy"],
    )

    record_id = insert_password_record(password_record)

    return build_success_response(
        {
            "message": "Password saved successfully.",
            "record_id": record_id,
            "strength": analysis_result["strength"],
            "score": analysis_result["score"],
            "entropy": analysis_result["entropy"],
        },
        status_code=201,
    )


@password_bp.route("/password-history", methods=["GET"])
def password_history():
    history_records = fetch_all_records()

    return build_success_response(
        {
            "count": len(history_records),
            "history": history_records,
        }
    )


@password_bp.route("/clear-history", methods=["DELETE"])
def clear_history():
    deleted_records = clear_all_records()

    return build_success_response(
        {
            "message": "History cleared.",
            "deleted_count": deleted_records,
        }
    )


@password_bp.route("/health", methods=["GET"])
def health():
    return build_success_response(
        {
            "status": "healthy",
        }
    )