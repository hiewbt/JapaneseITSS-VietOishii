from flask import Blueprint, jsonify, request
import flask_login

from models import db
from models.like import Like


like_blueprint = Blueprint("likes", __name__)


@like_blueprint.route("/api/like", methods=["POST"])
def like():
    data = request.get_json()
    
    if flask_login.current_user.is_authenticated:
        new_like = Like()
        new_like.dish_id = int(data["dish_id"])
        new_like.user_id = flask_login.current_user.id
        
        db.session.add(new_like)
        db.session.commit()
        
        return jsonify({"message": "Liked"})
    else:
        return jsonify({"error": "Anonymous user cannot like"}), 400