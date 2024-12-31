from unidecode import unidecode as udec

from . import db


class Dish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    description = db.Column(db.String(1000))
    flavor = db.Column(db.String(500))
    similar_japanese_dish = db.Column(db.String(500))
    ingredients = db.Column(db.String(1000))
    img_path = db.Column(db.String(500))
    category = db.Column(db.String(50))
    region = db.Column(db.String(100))
    allergy = db.Column(db.String(500))
    rating = db.Column(db.Float, default=0.0)
    num_ratings = db.Column(db.Integer, default=0)
    num_likes = db.Column(db.Integer, default=0)
    j_likes = db.Column(db.Integer, default=0)
    j_dislikes = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "flavor": self.flavor,
            "similar_japanese_dish": self.similar_japanese_dish,
            "ingredients": self.ingredients,
            "img_path": self.img_path,
            "category": self.category,
            "region": self.region,
            "allergy": self.allergy,
            "rating": self.rating,
            "num_likes": self.num_likes,
            "j_likes": self.j_likes,
            "j_dislike": self.j_dislikes
        }
    
    def meet_criteria(self, flavors: list, ingredients: list, allergy: list, region: list = None):
        if flavors is None or len(flavors) == 0:
            c1 = True
        else:
            c1 = any(udec(f.lower()) in udec(self.flavor.lower()) for f in flavors)
        
        if ingredients is None or len(ingredients) == 0:
            c2 = True
        else:
            c2 = any(udec(i.lower()) in udec(self.ingredients.lower()) for i in ingredients)
        
        if allergy is None or len(allergy) == 0:
            c3 = True
        else:
            c3 = all(udec(a.lower()) not in udec(self.ingredients.lower()) for a in allergy)
            
        if region is None or len(region) == 0:
            c4 = True
        else:
            c4 = any(udec(r).lower() in udec(self.region).lower() for r in region)
        
        return c1 and c2 and c3 and c4