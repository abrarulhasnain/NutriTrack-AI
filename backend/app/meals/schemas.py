from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID


class MealItemCreate(BaseModel):
    food_id: Optional[UUID] = None
    custom_food_id: Optional[UUID] = None
    quantity: Decimal
    unit: str

class MealCreate(BaseModel):
    meal_date: date
    meal_type: str
    original_text: Optional[str] = None
    items: List[MealItemCreate]

class MealItemResponse(BaseModel):
    id: UUID
    food_id: Optional[UUID] = None
    custom_food_id: Optional[UUID] = None
    quantity: Decimal
    unit: str
    calories: Decimal
    protein: Decimal
    carbs: Decimal
    fat: Decimal
    fiber: Decimal
    sugar: Decimal

    class Config:
        from_attributes = True


class MealResponse(BaseModel):
    id: UUID
    meal_date: date
    meal_type: str
    original_text: Optional[str] = None
    total_calories: Decimal
    total_protein: Decimal
    total_carbs: Decimal
    total_fat: Decimal
    total_fiber: Decimal
    total_sugar: Decimal
    source: str
    created_at: datetime
    items: List[MealItemResponse]

    class Config:
        from_attributes = True