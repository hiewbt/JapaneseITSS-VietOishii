from flask import Flask
from flask_cors import CORS
import os

from models import db
from controllers import *
from controllers.user_controller import login_manager


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins="*")    

    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DB_URI"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.init_app(app)
    
    app.register_blueprint(user_blueprint)
    app.register_blueprint(dish_blueprint)
    app.register_blueprint(util_blueprint)
    app.register_blueprint(like_blueprint)
    app.register_blueprint(comment_blueprint)
    
    with app.app_context():
        db.create_all()
    
    login_manager.init_app(app) 
    
    return app


app = create_app()

if __name__ == '__main__':
    host = os.environ["HOST"]
    port = os.environ["PORT"]
    app.run(host, port, debug=True)
