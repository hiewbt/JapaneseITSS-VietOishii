from flask import Flask
from flask_login import LoginManager
from models import db
from controllers import dish_blueprint, user_blueprint
from flask_cors import CORS
import os

from config import *


def create_app():
    app = Flask(__name__)
    
    app.secret_key = os.environ["SECRET_KEY"]
    
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    CORS(app)
    
    db.init_app(app)
    
    app.register_blueprint(user_blueprint)
    app.register_blueprint(dish_blueprint)
    
    with app.app_context():
        db.create_all()
        
    login_manager = LoginManager(app)
    login_manager.login_view = "login"
    return app


if __name__ == '__main__':
    app = create_app()
    
    app.run(HOST, PORT, debug=True)
