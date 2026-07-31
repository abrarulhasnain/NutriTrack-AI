from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
class RecipeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    servings: int = 1
    
class RecipeResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: Optional[str]
    servings: int

    total_calories: Decimal
    total_protein: Decimal
    total_carbs: Decimal
    total_fat: Decimal
    total_fiber: Decimal
    total_sugar: Decimal

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
