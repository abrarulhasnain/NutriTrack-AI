from datetime import date
from decimal import Decimal
from pydantic import BaseModel

from app.meals.schemas import MealResponse


# A single nutrient's consumed amount vs the user's goal
class NutrientProgress(BaseModel):
    consumed: Decimal
    goal: Decimal


# Water consumed vs goal for the day
class WaterProgress(BaseModel):
    consumed_ml: int
    goal_ml: int


# Full dashboard response for a given date
class DashboardResponse(BaseModel):
    date: date
    calories: NutrientProgress
    protein: NutrientProgress
    carbs: NutrientProgress
    fat: NutrientProgress
    water: WaterProgress
    meals: list[MealResponse]