from . import db


class Dish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
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
    
    def meet_criteria(self, flavors: list, ingredients: list, allergy: list):
        c1 = any(f.lower() in self.flavor.lower() for f in flavors)
        c2 = any(i.lower() in self.ingredients.lower() for i in ingredients)
        c3 = all(a.lower() not in self.ingredients.lower() for a in allergy)
        
        return c1 and c2 and c3