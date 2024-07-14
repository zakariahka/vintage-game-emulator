from . import mongo
from flask_login import UserMixin
from bson.objectid import ObjectId

class User(UserMixin):
    def __init__(self, username, password, _id=None):
        self.username = username
        self.password = password
        self.id = str(_id)

    @staticmethod
    def get(user_id):
        user_data = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user_data:
            return User(user_data['username'], user_data['password'], user_data['_id'])
        return None

    @staticmethod
    def create(username, password):
        result = mongo.db.users.insert_one({"username": username, "password": password})
        return User(username, password, result.inserted_id)

    @staticmethod
    def find_by_username(username):
        user_data = mongo.db.users.find_one({"username": username})
        if user_data:
            return User(user_data['username'], user_data['password'], user_data['_id'])
        return None

class GameState:
    @staticmethod
    def save(user_id, game_state):
        existing_state = mongo.db.game_states.find_one({"user_id": user_id})
        if existing_state:
            mongo.db.game_states.update_one(
                {"user_id": user_id},
                {"$set": {"game_state": game_state}}
            )
        else:
            mongo.db.game_states.insert_one({"user_id": user_id, "game_state": game_state})

    @staticmethod
    def load(user_id):
        return mongo.db.game_states.find_one({"user_id": user_id})

class HighScore:
    @staticmethod
    def save(user_id, game, score):
        mongo.db.high_scores.insert_one({"user_id": user_id, "game": game, "score": score})

    @staticmethod
    def get_all():
        return mongo.db.high_scores.find()
