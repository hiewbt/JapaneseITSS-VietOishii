from . import db


class Like(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    dish_id = db.Column(db.Integer, db.ForeignKey("dish.id"), primary_key=True)
    
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "dish_id": self.dish_id
        }
