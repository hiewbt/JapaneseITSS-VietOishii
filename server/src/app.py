from flask import Flask
from models import db
from controllers import dish_blueprint, user_blueprint

from config import *

def create_app():
    app = Flask(__name__)
    
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.init_app(app)
    
    app.register_blueprint(user_blueprint)
    app.register_blueprint(dish_blueprint)
    
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    app.run(HOST, PORT, debug=True)
