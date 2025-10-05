from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.routes import single_analysis_bp


def create_app(config=Config):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config)
    app.register_blueprint(single_analysis_bp)

    return app
