from flask import Blueprint, jsonify

from models.dish import Dish


dish_blueprint = Blueprint("dishes", __name__)

@dish_blueprint.route("/api/dishes", methods=["GET"])
def get_dishes():
    dishes = Dish.query.all()
    return jsonify([dish.to_dict() for dish in dishes])

