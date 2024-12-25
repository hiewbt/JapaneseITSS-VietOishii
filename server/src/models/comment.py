from . import db


class Comment(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    dish_id = db.Column(db.Integer, db.ForeignKey("dish.id"), primary_key=True)
    content = db.Column(db.String(1000), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "dish_id": self.dish_id,
            "content": self.content,
            "stars": self.stars
        }
