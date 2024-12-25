from flask import Blueprint, jsonify, request
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from translate import Translator

from models import db
from models.user import User


util_blueprint = Blueprint("utils", __name__)


@util_blueprint.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json()
    
    translator = Translator(to_lang=data["to_lang"])
    
    return jsonify({"result": translator.translate(data["text"])})
    