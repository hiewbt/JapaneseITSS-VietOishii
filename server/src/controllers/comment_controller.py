from flask import Blueprint, jsonify, request
import flask_login

from models import db
from models.comment import Comment
from models.user import User


comment_blueprint = Blueprint("comments", __name__)


@comment_blueprint.route("/api/comment", methods=["POST"])
def comment():
    data = request.get_json()
    
    if flask_login.current_user.is_authenticated:
        new_comment = Comment(
            user_id=flask_login.current_user.id,
            **data
        )
        
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({"message": "Commented"})
    
    else:
        return jsonify({"error": "Anonymous user cannot comment"}), 400


@comment_blueprint.route("/api/get_comments", methods=["POST"])
def get_comments():
    data = request.get_json()
    
    dish_id = data["dish_id"]
    
    comments_with_users = (
        db.session.query(Comment, User)
        .join(User, Comment.user_id == User.id)
        .filter(Comment.dish_id == dish_id)
    )
    comments = []
    
    for comment, user in comments_with_users:        
        comments.append(dict(
            username=user.username,
            **comment.to_dict()
        ))
        
    return jsonify(comments)