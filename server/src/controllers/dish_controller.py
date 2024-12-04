from flask import Blueprint, jsonify, request

from models.dish import Dish


dish_blueprint = Blueprint("dishes", __name__)

@dish_blueprint.route("/api/dishes", methods=["GET"])
def get_dishes():
    dishes = Dish.query.all()
    return jsonify([dish.to_dict() for dish in dishes])


@dish_blueprint.route("/api/filter_dishes", methods=["POST"])
def filter_dishes():
    data = request.get_json()
    dishes = Dish.query.all()
    
    dishes_filtered = filter(
        lambda item: item.meet_criteria(data["flavors"], data["ingredients"], data["allergy"]),
        dishes
    )
    
    return jsonify([dish.to_dict() for dish in dishes_filtered])
