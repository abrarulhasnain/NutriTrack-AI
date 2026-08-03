from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CustomFoodCreate(BaseModel):
    name: str
    serving_size: Decimal
    serving_unit: str
    calories: Decimal
    protein: Decimal
    carbs: Decimal
    fat: Decimal
    fiber: Decimal
    sugar: Decimal


class CustomFoodUpdate(BaseModel):
    name: Optional[str] = None
    serving_size: Optional[Decimal] = None
    serving_unit: Optional[str] = None
    calories: Optional[Decimal] = None
    protein: Optional[Decimal] = None
    carbs: Optional[Decimal] = None
    fat: Optional[Decimal] = None
    fiber: Optional[Decimal] = None
    sugar: Optional[Decimal] = None


class CustomFoodResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    serving_size: Decimal
    serving_unit: str
    calories: Decimal
    protein: Decimal
    carbs: Decimal
    fat: Decimal
    fiber: Decimal
    sugar: Decimal
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)