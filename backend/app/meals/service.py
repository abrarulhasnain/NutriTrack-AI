from sqlalchemy.orm import Session
from app.meals.repository import MealRepository
from app.meals.models import Meal
from app.meals.meal_items import MealItem
from app.meals.schemas import MealCreate


class MealService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = MealRepository(db)

    def create_meal(self, user_id, payload: MealCreate):
        meal_items = []
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0
        total_fiber = 0
        total_sugar = 0

        for item in payload.items:

            if not item.food_id and not item.custom_food_id:
                raise ValueError("Har item mein food_id ya custom_food_id zaroor hona chahiye")

            if item.food_id and item.custom_food_id:
                raise ValueError("Ek item mein food_id aur custom_food_id dono nahi ho sakte")

            if item.food_id:
                food = self.repository.get_food_by_id(item.food_id)
                if not food:
                    raise ValueError(f"Food id {item.food_id} nahi mila")
            else:
                food = self.repository.get_custom_food_by_id(item.custom_food_id)
                if not food:
                    raise ValueError(f"Custom food id {item.custom_food_id} nahi mila")

            # Nutrition Engine: serving size ke hisaab se scale karo
            scale = item.quantity / food.serving_size

            item_calories = food.calories * scale
            item_protein = food.protein * scale
            item_carbs = food.carbs * scale
            item_fat = food.fat * scale
            item_fiber = food.fiber * scale
            item_sugar = food.sugar * scale

            meal_item = MealItem(
                food_id=item.food_id,
                custom_food_id=item.custom_food_id,
                quantity=item.quantity,
                unit=item.unit,
                calories=item_calories,
                protein=item_protein,
                carbs=item_carbs,
                fat=item_fat,
                fiber=item_fiber,
                sugar=item_sugar
            )
            meal_items.append(meal_item)

            total_calories += item_calories
            total_protein += item_protein
            total_carbs += item_carbs
            total_fat += item_fat
            total_fiber += item_fiber
            total_sugar += item_sugar

        meal = Meal(
            user_id=user_id,
            meal_date=payload.meal_date,
            meal_type=payload.meal_type,
            original_text=payload.original_text or "",
            total_calories=total_calories,
            total_protein=total_protein,
            total_carbs=total_carbs,
            total_fat=total_fat,
            total_fiber=total_fiber,
            total_sugar=total_sugar,
            source="manual",
            items=meal_items
        )

        return self.repository.create_meal(meal)

    def get_meal(self, meal_id, user_id):
        meal = self.repository.get_meal_by_id(meal_id, user_id)
        if not meal:
            raise ValueError("Meal nahi mili")
        return meal

    def get_meals(self, user_id, meal_date=None):
        return self.repository.get_meals_by_user(user_id, meal_date)

    def delete_meal(self, meal_id, user_id):
        meal = self.repository.get_meal_by_id(meal_id, user_id)
        if not meal:
            raise ValueError("Meal nahi mili")
        self.repository.delete_meal(meal)