from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from config import *


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = "login"


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }


class Dish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(1000))
    flavor = db.Column(db.String(500))
    similar_japanese_dish = db.Column(db.String(500))
    ingredients = db.Column(db.String(1000))
    img_path = db.Column(db.String(500))
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "flavor": self.flavor,
            "similar_japanese_dish": self.similar_japanese_dish,
            "ingredients": self.ingredients,
            "img_path": self.img_path
        }


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return "<p style=\"font-size: 100px\">Nhìn cc</p>"


@app.route("/api/register", methods=["POST"])
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


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not all(k in data for k in ["username", "password"]):
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        login_user(user)
        return jsonify({"message": "Logged in successfully", "user": user.to_dict()}), 200

    return jsonify({"error": "Invalid username or password"}), 401


@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


@app.route("/api/profile", methods=["GET"])
@login_required
def get_profile():
    return jsonify({"user": current_user.to_dict()}), 200


@app.route("/api/change-password", methods=["POST"])
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


@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized access"}), 401


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404


@app.route("/api/dishes", methods=["GET"])
def get_dishes():
    dishes = Dish.query.all()
    return jsonify([dish.to_dict() for dish in dishes])


if __name__ == "__main__":
    app.run(HOST, PORT, debug=True)
