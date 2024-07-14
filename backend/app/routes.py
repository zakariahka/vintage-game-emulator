from flask import Blueprint, request, jsonify
from .models import User, GameState, HighScore
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__)
game_bp = Blueprint('game', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.find_by_username(data['username']):
        return jsonify({"message": "User already exists"}), 400
    User.create(data['username'], data['password'])
    return jsonify({"message": "User registered successfully"})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.find_by_username(data['username'])
    if user and user.password == data['password']:
        login_user(user)
        return jsonify({"message": "Login successful"})
    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"})

@game_bp.route('/save_game', methods=['POST'])
@login_required
def save_game():
    data = request.get_json()
    GameState.save(current_user.id, data['game_state'])
    return jsonify({"message": "Game state saved successfully"})

@game_bp.route('/load_game', methods=['GET'])
@login_required
def load_game():
    game_state = GameState.load(current_user.id)
    if game_state:
        return jsonify({"game_state": game_state['game_state']})
    return jsonify({"message": "No saved game state found"}), 404

@game_bp.route('/leaderboard', methods=['GET'])
def leaderboard():
    high_scores = HighScore.get_all()
    leaderboard = [{"username": User.get(score['user_id']).username, "game": score['game'], "score": score['score']} for score in high_scores]
    return jsonify({"leaderboard": leaderboard})
