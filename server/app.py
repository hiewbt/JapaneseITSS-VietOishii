from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

from config import *


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.String(ID_MAXLEN), primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    

class Dish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(1000))
    flavor = db.Column(db.String(500))
    similar_japanese_dish = db.Column(db.String(500))
    ingredients = db.Column(db.String(1000))
    img_path = db.Column(db.String(500))


with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return "<p style=\"font-size: 100px\">Nhìn cc</p>"


@app.route("/api/add_user", methods=["POST"])
def create_user():
    data = request.get_json(force=True)
    
    print(f">>> Got user {data["id"]}")
    
    if data is None or "id" not in data or "name" not in data or "email" not in data:
        return jsonify({"error": "Invalid user"}), 400

    user = User(
        id=data["data"],
        name=data["name"],
        email=data["email"]
    )
    
    db.session.add(user)
    db.session.commit()
    
    print(f">>> Added user {user.id}")
    
    return jsonify({"message": "User created", "id": user.id}), 201


@app.route("/api/dishes", methods=["GET"])
def get_dishes():
    dishes = Dish.query.all()
    return dishes


@app.route("/api/add_dishes", methods=["POST"])
def add_dishes():
    data = request.get_json()
    


if __name__ == "__main__":
    app.run(HOST, PORT, debug=True)
    