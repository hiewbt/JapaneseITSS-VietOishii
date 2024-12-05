from flask import Blueprint, jsonify, request
from flask_login import login_user, login_required, logout_user, current_user

from models import db
from models.user import User


user_blueprint = Blueprint("users", __name__)


@user_blueprint.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not any(k in data for k in ["username", "email", "password"]):
        return jsonify({"error": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    try:
        new_user = User(
            username=data["username"],
            email=data["email"]
        )
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@user_blueprint.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not all(k in data for k in ["username", "password"]):
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        login_user(user)
        return jsonify({"message": "Logged in successfully", "user": user.to_dict()}), 200

    return jsonify({"error": "Invalid username or password"}), 401


@user_blueprint.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


@user_blueprint.route("/api/profile", methods=["GET"])
@login_required
def get_profile():
    return jsonify({"user": current_user.to_dict()}), 200


@user_blueprint.route("/api/change-password", methods=["POST"])
@login_required
def change_password():
    data = request.get_json()

    if not all(k in data for k in ["old_password", "new_password"]):
        return jsonify({"error": "Old password and new password are required"}), 400

    if not current_user.check_password(data["old_password"]):
        return jsonify({"error": "Current password is incorrect"}), 400

    try:
        current_user.set_password(data["new_password"])
        db.session.commit()
        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@user_blueprint.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized access"}), 401


@user_blueprint.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404


@user_blueprint.route("/api/check-auth", methods=["GET"])
@login_required
def check_auth():
    return jsonify({"message": f"User {current_user.id} is authenticated"}), 200
