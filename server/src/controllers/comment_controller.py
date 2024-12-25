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


@comment_blueprint.route("/api/get_comments", methods=["POST"])
def get_comments():
    data = request.get_json()
    
    dish_id = data["dish_id"]
    
    comments_with_users = db.session.query(Comment).outerjoin(User).filter(Comment.dish_id == dish_id)
    
    comments = []
    
    for comment in comments_with_users:
        user_id = comment.user_id
        username = comment.users[0].username
        content = comment.content
        stars = comment.stars
        
        comments.append({"user_id": user_id, "username": username, "content": content, "stars": stars})
        
    return jsonify(comments)