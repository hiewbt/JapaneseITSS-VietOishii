from flask import Flask
from flask_cors import CORS
import os

from models import db
from controllers import dish_blueprint, user_blueprint
from controllers.user_controller import login_manager
from config import *


def create_app():
    app = Flask(__name__)
    
    app.secret_key = os.environ["SECRET_KEY"]
    
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.init_app(app)
    
    app.register_blueprint(user_blueprint)
    app.register_blueprint(dish_blueprint)
    
    with app.app_context():
        db.create_all()
    
    login_manager.init_app(app)
    
    CORS(app)
    
    return app


app = create_app()

if __name__ == '__main__':
    app.run(HOST, PORT, debug=True)
