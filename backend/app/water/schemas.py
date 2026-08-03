from uuid import UUID
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class WaterLogCreate(BaseModel):
    date: date
    amount_ml: int


class WaterLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    date: date
    amount_ml: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WaterTotalResponse(BaseModel):
    date: date
    total_ml: int