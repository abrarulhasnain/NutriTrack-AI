from datetime import date as date_type
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.profiles.models import UserProfile
from app.meals.models import Meal
from app.water.models import WaterLog


def get_profile(db: Session, user_id: UUID):
    """
    Fetches the user's profile, which contains their calorie/macro/water goals.
    """
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()


def get_meals_for_date(db: Session, user_id: UUID, target_date: date_type):
    """
    Fetches all meals logged by the user on a specific date.
    """
    return (
        db.query(Meal)
        .filter(
            Meal.user_id == user_id,
            Meal.meal_date == target_date,
        )
        .order_by(Meal.created_at.asc())
        .all()
    )


def get_water_total_for_date(db: Session, user_id: UUID, target_date: date_type):
    """
    Sums the total water intake (in ml) for a specific date.
    """
    total = (
        db.query(func.sum(WaterLog.amount_ml))
        .filter(
            WaterLog.user_id == user_id,
            WaterLog.date == target_date,
        )
        .scalar()
    )

    return total or 0