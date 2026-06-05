from flask import Flask, jsonify

from config import Config
from database.db import init_db
from routes.password_routes import password_bp


app = Flask(__name__)

app.config["SECRET_KEY"] = Config.SECRET_KEY
app.config["DEBUG"] = Config.DEBUG


def configure_cors(application: Flask) -> str:
    """
    Configure CORS support.

    Uses flask-cors when available and falls back to a minimal
    manual implementation otherwise.
    """
    try:
        from flask_cors import CORS

        CORS(application, resources={r"/*": {"origins": "*"}})
        return "flask-cors"

    except ImportError:

        @application.after_request
        def add_cors_headers(response):
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Headers"] = (
                "Content-Type,Authorization"
            )
            response.headers["Access-Control-Allow-Methods"] = (
                "GET,POST,DELETE,OPTIONS"
            )
            return response

        @application.route("/<path:path>", methods=["OPTIONS"])
        @application.route("/", methods=["OPTIONS"])
        def options_handler(path: str = ""):
            return jsonify({}), 200

        return "manual fallback"


cors_mode = configure_cors(app)


# Initialize database schema
init_db()

# Register application routes
app.register_blueprint(password_bp)


@app.route("/")
def home():
    return jsonify(
        {
            "success": True,
            "message": "Password Strength Analyzer Backend Running",
        }
    )


@app.errorhandler(404)
def handle_not_found(error):
    return (
        jsonify(
            {
                "success": False,
                "error": "Endpoint not found.",
            }
        ),
        404,
    )


@app.errorhandler(405)
def handle_method_not_allowed(error):
    return (
        jsonify(
            {
                "success": False,
                "error": "Method not allowed.",
            }
        ),
        405,
    )


@app.errorhandler(500)
def handle_internal_server_error(error):
    return (
        jsonify(
            {
                "success": False,
                "error": "Internal server error.",
            }
        ),
        500,
    )


if __name__ == "__main__":
    startup_banner = f"""
╔══════════════════════════════════════════════╗
║   Password Strength Analyzer API            ║
║   Running on http://localhost:{Config.PORT:<5}         ║
║   Environment : {Config.FLASK_ENV:<27}║
║   CORS mode   : {cors_mode:<27}║
╚══════════════════════════════════════════════╝
"""

    print(startup_banner)

    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
    )