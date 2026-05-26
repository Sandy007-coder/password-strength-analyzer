from flask import Flask, jsonify

from config                 import Config
from database.db            import init_db
from routes.password_routes import password_bp

app = Flask(__name__)
app.config["SECRET_KEY"] = Config.SECRET_KEY
app.config["DEBUG"]      = Config.DEBUG

try:
    from flask_cors import CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    _cors_mode = "flask-cors"
except ImportError:
    
    @app.after_request
    def _add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"]  = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,OPTIONS"
        return response

    @app.route("/<path:p>", methods=["OPTIONS"])
    @app.route("/", methods=["OPTIONS"])
    def _options_handler(p=""):
        return jsonify({}), 200

    _cors_mode = "manual fallback"


#  Database 
init_db()   


#  Blueprints 
app.register_blueprint(password_bp)

#  Home Route 
@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "Password Strength Analyzer Backend Running"
    })


#  Global error handlers 
@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "error": "Endpoint not found."}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"success": False, "error": "Method not allowed."}), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "error": "Internal server error."}), 500


#  Entry point 
if __name__ == "__main__":
    print(f"""
╔══════════════════════════════════════════════╗
║   Password Strength Analyzer API             ║
║   Running on http://localhost:{Config.PORT:<5}          ║
║   Environment : {Config.FLASK_ENV:<27}║
║   CORS mode   : {_cors_mode:<27}║
╚══════════════════════════════════════════════╝
    """)
    app.run(
        host  = Config.HOST,
        port  = Config.PORT,
        debug = Config.DEBUG,
    )
