import logging
import sys

from flask import Flask, jsonify

from config import Config
from database.db import init_db
from routes.password_routes import password_bp

logging.basicConfig(
    level=logging.DEBUG if Config.DEBUG else logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["SECRET_KEY"] = Config.SECRET_KEY
app.config["DEBUG"]      = Config.DEBUG


def _configure_cors() -> str:
    try:
        from flask_cors import CORS
        CORS(app, resources={r"/*": {"origins": "*"}})
        return "flask-cors"
    except ImportError:
        pass

    @app.after_request
    def _add_cors(response):
        response.headers["Access-Control-Allow-Origin"]  = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,OPTIONS"
        return response

    @app.route("/", methods=["OPTIONS"])
    @app.route("/<path:path>", methods=["OPTIONS"])
    def _options(path: str = ""):
        return jsonify({}), 200

    return "manual fallback"


def _register_error_handlers() -> None:
    @app.errorhandler(404)
    def _not_found(e):
        return jsonify({"success": False, "error": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def _method_not_allowed(e):
        return jsonify({"success": False, "error": "Method not allowed."}), 405

    @app.errorhandler(500)
    def _internal_error(e):
        logger.exception("Unhandled server error: %s", e)
        return jsonify({"success": False, "error": "Internal server error."}), 500


cors_mode = _configure_cors()
_register_error_handlers()

init_db()
app.register_blueprint(password_bp)


@app.route("/")
def home():
    return jsonify({"success": True, "message": "Password Strength Analyzer API is running."})


if __name__ == "__main__":
    logger.info(
        "Starting Password Strength Analyzer — env=%s host=%s port=%d cors=%s",
        Config.FLASK_ENV, Config.HOST, Config.PORT, cors_mode,
    )
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)