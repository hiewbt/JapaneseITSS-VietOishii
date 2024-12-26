from . import db


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    dish_id = db.Column(db.Integer, db.ForeignKey("dish.id"))
    content = db.Column(db.String(1000), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    img_url = db.Column(db.String(500))
    
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "dish_id": self.dish_id,
            "content": self.content,
            "stars": self.stars
        }
