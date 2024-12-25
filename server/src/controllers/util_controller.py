from flask import Blueprint, jsonify, request
from translate import Translator


util_blueprint = Blueprint("utils", __name__)


@util_blueprint.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json()
    
    translator = Translator(to_lang=data["to_lang"])
    
    return jsonify({"result": translator.translate(data["text"])})
    