from flask import Blueprint, jsonify, request
import flask_login

from models import db
from models.dish import Dish
from models.like import Like
from models.user import User


like_blueprint = Blueprint("likes", __name__)


@like_blueprint.route("/api/like", methods=["POST"])
def like():
    data = request.get_json()
    
    if flask_login.current_user.is_authenticated:
        try:
            new_like = Like(
                dish_id=int(data["dish_id"]),
                user_id = flask_login.current_user.id
            )
            
            db.session.add(new_like)
            db.session.commit()
            
        except:
            return jsonify({"error": "You cannot like it. Some error occured :))"}), 400
        
        return jsonify({"message": "Liked"})
    else:
        return jsonify({"error": "Anonymous user cannot like"}), 400
    

@like_blueprint.route("/api/users_liked", methods=["POST"])
def get_users_liked():
    data = request.get_json()
    
    dish_id = data["dish_id"]
    
    likes = Like.query.filter(Like.dish_id == dish_id)
    
    users_liked = []
    
    for like in likes:
        user = User.query.filter(User.id == like.user_id)[0]
        user = user.to_dict()
        user.pop("email")
        users_liked.append(user)
        
    return jsonify(users_liked)


@like_blueprint.route("/api/liked_dishes")
def get_liked_dishes():
    likes = Like.query.filter(Like.user_id == flask_login.current_user.id)
    
    like_dicts = []
    
    for like in likes:
        dish = Dish.query.filter(Dish.id == like.dish_id).first()
        like_dicts.append(dict(**dish.to_dict()))
    
    return jsonify(like_dicts)