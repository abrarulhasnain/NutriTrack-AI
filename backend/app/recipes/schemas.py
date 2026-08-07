from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RecipeItemCreate(BaseModel):
    food_id: Optional[UUID] = None
    custom_food_id: Optional[UUID] = None
    quantity: Decimal
    unit: str


class RecipeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    servings: int = 1
    items: List[RecipeItemCreate]


class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    servings: Optional[int] = None
    items: Optional[List[RecipeItemCreate]] = None


class RecipeItemResponse(BaseModel):
    id: UUID
    food_id: Optional[UUID] = None
    custom_food_id: Optional[UUID] = None
    quantity: Decimal
    unit: str

    model_config = ConfigDict(from_attributes=True)


class RecipeResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: Optional[str] = None
    servings: int

    total_calories: Decimal
    total_protein: Decimal
    total_carbs: Decimal
    total_fat: Decimal
    total_fiber: Decimal
    total_sugar: Decimal

    created_at: datetime
    updated_at: datetime

    items: List[RecipeItemResponse]

    model_config = ConfigDict(from_attributes=True)