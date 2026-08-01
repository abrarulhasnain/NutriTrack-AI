from sqlalchemy.orm import Session, joinedload
from app.meals.models import Meal
from app.meals.meal_items import MealItem
from app.nutrition.models import Food
from app.custom_foods.models import CustomFood


class MealRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_food_by_id(self, food_id):
        return self.db.query(Food).filter(Food.id == food_id).first()

    def get_custom_food_by_id(self, custom_food_id):
        return self.db.query(CustomFood).filter(CustomFood.id == custom_food_id).first()

    def create_meal(self, meal: Meal):
        self.db.add(meal)
        self.db.commit()
        self.db.refresh(meal)
        return meal

    def get_meal_by_id(self, meal_id, user_id):
        return self.db.query(Meal).options(
            joinedload(Meal.items)
        ).filter(
            Meal.id == meal_id,
            Meal.user_id == user_id
        ).first()

    def get_meals_by_user(self, user_id, meal_date=None):
        query = self.db.query(Meal).options(
            joinedload(Meal.items)
        ).filter(Meal.user_id == user_id)

        if meal_date:
            query = query.filter(Meal.meal_date == meal_date)

        return query.order_by(Meal.created_at.desc()).all()

    def delete_meal(self, meal):
        self.db.delete(meal)
        self.db.commit()