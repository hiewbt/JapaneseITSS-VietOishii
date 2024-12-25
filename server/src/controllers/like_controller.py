from flask import Blueprint, jsonify, request
import flask_login

from models.dish import Dish


like_blueprint = Blueprint("dishes", __name__)


@like_blueprint.route("/api/like", methods=["GET", "POST"])
def like():
    ...