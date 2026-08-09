from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class FoodResponse(BaseModel):
    id: UUID
    name: str
    serving_size: Decimal
    serving_unit: str
    calories: Decimal
    protein: Decimal
    carbs: Decimal
    fat: Decimal
    fiber: Decimal
    sugar: Decimal

    model_config = ConfigDict(from_attributes=True)