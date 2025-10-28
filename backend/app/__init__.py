from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.routes import analysis_bp


def create_app(config=Config):
    app = Flask(__name__)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*", "allow_headers": "*", "methods": "*"}},
    )
    app.config.from_object(config)
    app.config["DEBUG"] = False
    app.register_blueprint(analysis_bp)

    return app
