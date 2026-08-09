from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class FoodResponse(BaseModel):
    """Response schema for a single food item from the reference database."""

    model_config = ConfigDict(from_attributes=True)

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
