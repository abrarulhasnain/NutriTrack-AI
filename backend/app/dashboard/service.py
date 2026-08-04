from datetime import date as date_type
from uuid import UUID

from sqlalchemy.orm import Session

from app.dashboard.repository import (
    get_profile,
    get_meals_for_date,
    get_water_total_for_date,
)
from app.dashboard.schemas import DashboardResponse, NutrientProgress, WaterProgress


def build_dashboard(db: Session, user_id: UUID, target_date: date_type) -> DashboardResponse:
    """
    Combines data from Profiles, Meals, and Water modules into a single
    dashboard view for the given date. Does not calculate any nutrition
    itself - it only aggregates totals that were already calculated by
    the Nutrition Engine when the meals were created.
    """

    profile = get_profile(db, user_id)
    if not profile:
        raise ValueError("Profile not found, please complete your profile first")

    meals = get_meals_for_date(db, user_id, target_date)
    water_total_ml = get_water_total_for_date(db, user_id, target_date)

    # Sum up totals across all of today's meals
    total_calories = sum(meal.total_calories for meal in meals)
    total_protein = sum(meal.total_protein for meal in meals)
    total_carbs = sum(meal.total_carbs for meal in meals)
    total_fat = sum(meal.total_fat for meal in meals)

    return DashboardResponse(
        date=target_date,
        calories=NutrientProgress(consumed=total_calories, goal=profile.calorie_goal),
        protein=NutrientProgress(consumed=total_protein, goal=profile.protein_goal),
        carbs=NutrientProgress(consumed=total_carbs, goal=profile.carbs_goal),
        fat=NutrientProgress(consumed=total_fat, goal=profile.fat_goal),
        water=WaterProgress(consumed_ml=water_total_ml, goal_ml=profile.water_goal),
        meals=meals,
    )