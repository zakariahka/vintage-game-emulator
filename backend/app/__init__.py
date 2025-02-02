from flask import Flask
from flask_pymongo import PyMongo
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config

mongo = PyMongo()
login_manager = LoginManager()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)
    app.config.from_pyfile('config.py', silent=True)

    mongo.init_app(app)
    login_manager.init_app(app)
    jwt.init_app(app)

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    app.config['JWT_SECRET_KEY'] = app.config.get('SECRET_KEY')

    from .routes import auth_bp, game_bp, test_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(test_bp)

    return app
