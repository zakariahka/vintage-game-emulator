from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    app.config.from_pyfile('config.py', silent=True)

    db.init_app(app)
    login_manager.init_app(app)

    from .routes import auth_bp, game_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(game_bp)

    return app
