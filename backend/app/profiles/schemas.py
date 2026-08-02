from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class UserProfileCreate(BaseModel):
    full_name: str
    age: int
    gender: str
    height_cm: Decimal
    weight_kg: Decimal
    activity_level: str
    fitness_goal: str
    calorie_goal: int
    protein_goal: Decimal
    carbs_goal: Decimal
    fat_goal: Decimal
    water_goal: int


class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    age: int | None = None
    gender: str | None = None
    height_cm: Decimal | None = None
    weight_kg: Decimal | None = None
    activity_level: str | None = None
    fitness_goal: str | None = None
    calorie_goal: int | None = None
    protein_goal: Decimal | None = None
    carbs_goal: Decimal | None = None
    fat_goal: Decimal | None = None
    water_goal: int | None = None


class UserProfileResponse(BaseModel):
    user_id: str
    full_name: str
    age: int
    gender: str
    height_cm: Decimal
    weight_kg: Decimal
    activity_level: str
    fitness_goal: str
    calorie_goal: int
    protein_goal: Decimal
    carbs_goal: Decimal
    fat_goal: Decimal
    water_goal: int

    model_config = ConfigDict(from_attributes=True)