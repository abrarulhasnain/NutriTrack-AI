from uuid import UUID
from pydantic import BaseModel
from typing import Optional
from datetime import date


# Input received from the user
class AIExtractRequest(BaseModel):
    text: str                          # e.g. "2 boiled eggs and a glass of milk"
    meal_type: str                     # breakfast / lunch / dinner / snack
    log_date: Optional[date] = None    # if not provided, today's date will be used


# A single food item extracted by the AI from raw text
class ExtractedItem(BaseModel):
    name: str
    quantity: float
    unit: str


# A single item after matching against the foods table
class MatchedItem(BaseModel):
    extracted_name: str
    quantity: float
    unit: str
    food_id: Optional[UUID] = None
    matched_food_name: Optional[str] = None
    confidence: float
    matched: bool          # True = confident match found, False = needs manual selection


# Final response returned to the client
class AIExtractResponse(BaseModel):
    items: list[MatchedItem]
    meal_created: bool
    meal_id: Optional[UUID] = None