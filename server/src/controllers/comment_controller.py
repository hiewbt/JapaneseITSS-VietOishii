from flask import Blueprint, jsonify, request
import flask_login

from models import db
from models.comment import Comment
from models.like import Like
from models.user import User


comment_blueprint = Blueprint("comments", __name__)


@comment_blueprint.route("/api/comment", methods=["POST"])
def comment():
    data = request.get_json()
    
    if flask_login.current_user.is_authenticated:
        try:
            new_comment = Comment(
                user_id=flask_login.current_user.id,
                **data
            )
            
            db.session.add(new_comment)
            db.session.commit()
            
        except:
            return jsonify({"error": "You cannot comment. Some error occured :))"}), 400
        
        return jsonify({"message": "Commented"})
    else:
        return jsonify({"error": "Anonymous user cannot comment"}), 400


@comment_blueprint.route("/api/users_commented", methods=["POST"])
def get_users_commented():
    data = request.get_json()
    
    dish_id = data["dish_id"]
    
    comments = Comment.query.filter(Comment.dish_id == dish_id)
    
    users_commented = []
    
    for comment in comments:
        user = User.query.filter(User.id == comment.user_id)[0]
        user = user.to_dict()
        user.pop("email")
        users_commented.append(user)
        
    return jsonify(users_commented)