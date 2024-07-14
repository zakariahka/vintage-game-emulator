from flask import Blueprint, request, jsonify
from .models import User, GameState, HighScore
from flask_login import login_user, logout_user, login_required, current_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import mongo

auth_bp = Blueprint('auth', __name__)
game_bp = Blueprint('game', __name__)
test_bp = Blueprint('test', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password are required"}), 401
    if len(data['password']) < 8:
        return jsonify({"message": "Password must be at least 8 characters long"}), 402
    if User.find_by_username(data['username']):
        return jsonify({"message": "User already exists"}), 403
    user = User.create(data['username'], data['password'])
    access_token = create_access_token(identity={'id': user.id, 'username': user.username})
    return jsonify({"message": "User registered successfully", "user": {"id": user.id, "username": user.username}, "token": access_token}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password are required"}), 400
    user = User.find_by_username(data['username'])
    if user and user.password == data['password']:
        login_user(user)
        access_token = create_access_token(identity={'id': user.id, 'username': user.username})
        return jsonify({"message": "Login successful", "user": {"id": user.id, "username": user.username}, "token": access_token}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@game_bp.route('/save_game', methods=['POST'])
@jwt_required()
def save_game():
    data = request.get_json()
    user_id = get_jwt_identity()['id']
    GameState.save(user_id, data['game_state'])
    return jsonify({"message": "Game state saved successfully"})

@game_bp.route('/load_game', methods=['GET'])
@jwt_required()
def load_game():
    user_id = get_jwt_identity()['id']
    game_state = GameState.load(user_id)
    if game_state:
        return jsonify({"game_state": game_state['game_state']})
    return jsonify({"message": "No saved game state found"}), 404

@game_bp.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        high_scores = HighScore.get_all()
        leaderboard = [{"username": User.get(score['user_id']).username, "game": score['game'], "score": score['score']} for score in high_scores]
        return jsonify({"leaderboard": leaderboard}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500

@test_bp.route('/test_mongo_connection')
def test_mongo_connection():
    try:
        mongo.db.command('ping')
        return jsonify({"message": "Connected successfully to MongoDB!"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500
