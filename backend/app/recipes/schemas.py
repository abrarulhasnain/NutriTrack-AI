from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict
class RecipeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    servings: int = 1
    
class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    servings: Optional[int] = None

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
