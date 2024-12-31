from multiprocessing import Value
from flask import Blueprint, jsonify, request
from unidecode import unidecode as udec

from models.dish import Dish


dish_blueprint = Blueprint("dishes", __name__)


@dish_blueprint.route("/", methods=["GET"])
def index():
    return "<p style=\"font-size: 100px\">It worked nha ae</p>"


@dish_blueprint.route("/api/dishes", methods=["GET"])
def get_dishes():        
    dishes = Dish.query.all()
    return jsonify([dish.to_dict() for dish in dishes])


@dish_blueprint.route("/api/filter_dishes", methods=["POST"])
def filter_dishes():
    data = request.get_json()
    dishes = Dish.query.all()

    dishes_filtered = filter(
        lambda item: item.meet_criteria(
            data["flavors"], data["ingredients"], data["allergy"]),
        dishes
    )

    return jsonify([dish.to_dict() for dish in dishes_filtered])


@dish_blueprint.route("/api/get_dish/<int:id>", methods=["GET"])
def get_dish(id):
    dish = Dish.query.filter(Dish.id == id)[0]
    return jsonify(dish.to_dict())


@dish_blueprint.route("/api/search/<query>", methods=["GET"])
def search(query: str):
    def matched(query, dish):
        query = udec(query).lower()
        name = udec(dish.name).lower()
        desc = udec(dish.description).lower()
        japdish = udec(dish.similar_japanese_dish).lower()
        
        return (
            query in name or
            query in desc or
            query in japdish
        )

    dishes = Dish.query.all()
    return jsonify([dish.to_dict() for dish in filter(lambda dish: matched(query, dish), dishes)])


@dish_blueprint.route("/api/by_category/<category>", methods=["GET"])
def get_dishes_by_category(category):
    dishes = Dish.query.all()
    dishes = filter(lambda item: udec(category.lower()) in udec(item.category.lower()), dishes)

    return jsonify([dish.to_dict() for dish in dishes])


@dish_blueprint.route("/api/by_region/<region>", methods=["GET"])
def get_dishes_by_region(region):
    dishes = Dish.query.all()
    dishes = filter(lambda item: udec(region.lower()) in udec(item.region.lower()), dishes)
    
    return jsonify([dish.to_dict() for dish in dishes])
