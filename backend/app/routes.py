from flask import Blueprint, request, jsonify
from .models import db, User, GameState, HighScore
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__)
game_bp = Blueprint('game', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
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
    new_game_state = GameState(user_id=current_user.id, game_state=data['game_state'])
    db.session.add(new_game_state)
    db.session.commit()
    return jsonify({"message": "Game state saved successfully"})

@game_bp.route('/load_game', methods=['GET'])
@login_required
def load_game():
    game_state = GameState.query.filter_by(user_id=current_user.id).order_by(GameState.timestamp.desc()).first()
    if game_state:
        return jsonify({"game_state": game_state.game_state})
    return jsonify({"message": "No saved game state found"}), 404

@game_bp.route('/leaderboard', methods=['GET'])
def leaderboard():
    high_scores = HighScore.query.order_by(HighScore.score.desc()).all()
    leaderboard = [{"username": User.query.get(score.user_id).username, "game": score.game, "score": score.score} for score in high_scores]
    return jsonify({"leaderboard": leaderboard})
