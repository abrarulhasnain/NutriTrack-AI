from datetime import date as date_type
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.meals.models import Meal
from app.water.models import WaterLog


def get_daily_meal_totals(db: Session, user_id: UUID, from_date: date_type, to_date: date_type):
    """
    Returns one row per date with summed calories/protein/carbs/fat,
    for all meals logged between from_date and to_date (inclusive).
    """
    return (
        db.query(
            Meal.meal_date.label("date"),
            func.sum(Meal.total_calories).label("calories"),
            func.sum(Meal.total_protein).label("protein"),
            func.sum(Meal.total_carbs).label("carbs"),
            func.sum(Meal.total_fat).label("fat"),
        )
        .filter(
            Meal.user_id == user_id,
            Meal.meal_date >= from_date,
            Meal.meal_date <= to_date,
        )
        .group_by(Meal.meal_date)
        .all()
    )


def get_daily_water_totals(db: Session, user_id: UUID, from_date: date_type, to_date: date_type):
    """
    Returns one row per date with summed water amount_ml,
    for all water logs between from_date and to_date (inclusive).
    """
    return (
        db.query(
            WaterLog.date.label("date"),
            func.sum(WaterLog.amount_ml).label("water_ml"),
        )
        .filter(
            WaterLog.user_id == user_id,
            WaterLog.date >= from_date,
            WaterLog.date <= to_date,
        )
        .group_by(WaterLog.date)
        .all()
    )