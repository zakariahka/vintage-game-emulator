from flask import Blueprint, request, jsonify
from .models import User, GameState, HighScore
from flask_login import login_user, logout_user, login_required, current_user
from . import mongo

auth_bp = Blueprint('auth', __name__)
game_bp = Blueprint('game', __name__)
test_bp = Blueprint('test', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(f"Received data: {data}")
    if User.find_by_username(data['username']):
        print("User already exists") 
        return jsonify({"message": "User already exists"}), 400
    user = User.create(data['username'], data['password'])
    print(f"User created: {user.username}") 
    return jsonify({"message": "User registered successfully", "user": {"id": user.id, "username": user.username}})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Received data: {data}")
    user = User.find_by_username(data['username'])
    if user and user.password == data['password']:
        login_user(user)
        print(f"User logged in: {user.username}")
        return jsonify({"message": "Login successful", "user": {"id": user.id, "username": user.username}})
    print("Invalid credentials")  
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

@test_bp.route('/test_mongo_connection')
def test_mongo_connection():
    try:
        mongo.db.command('ping')
        return jsonify({"message": "Connected successfully to MongoDB!"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500