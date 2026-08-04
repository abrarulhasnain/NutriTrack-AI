from datetime import date as date_type, timedelta
from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from app.reports.repository import get_daily_meal_totals, get_daily_water_totals
from app.reports.schemas import DailyStat, ReportSummary, ReportResponse


def build_report(db: Session, user_id: UUID, from_date: date_type = None, to_date: date_type = None) -> ReportResponse:
    """
    Builds a nutrition report for a date range. Defaults to the last 7 days
    (including today) if no range is given. Merges meal totals and water
    totals by date, filling in zero for any day with no data.
    """

    if not to_date:
        to_date = date_type.today()
    if not from_date:
        from_date = to_date - timedelta(days=6)

    meal_rows = get_daily_meal_totals(db, user_id, from_date, to_date)
    water_rows = get_daily_water_totals(db, user_id, from_date, to_date)

    # Turn rows into lookup dicts keyed by date, for easy merging
    meals_by_date = {row.date: row for row in meal_rows}
    water_by_date = {row.date: row.water_ml for row in water_rows}

    daily_stats = []
    current_date = from_date

    while current_date <= to_date:
        meal_row = meals_by_date.get(current_date)

        daily_stats.append(
            DailyStat(
                date=current_date,
                calories=meal_row.calories if meal_row else Decimal(0),
                protein=meal_row.protein if meal_row else Decimal(0),
                carbs=meal_row.carbs if meal_row else Decimal(0),
                fat=meal_row.fat if meal_row else Decimal(0),
                water_ml=water_by_date.get(current_date, 0),
            )
        )
        current_date += timedelta(days=1)

    days_count = len(daily_stats)

    total_calories = sum(day.calories for day in daily_stats)
    total_protein = sum(day.protein for day in daily_stats)
    total_carbs = sum(day.carbs for day in daily_stats)
    total_fat = sum(day.fat for day in daily_stats)
    total_water_ml = sum(day.water_ml for day in daily_stats)

    summary = ReportSummary(
        days_count=days_count,
        total_calories=total_calories,
        avg_calories=total_calories / days_count,
        total_protein=total_protein,
        avg_protein=total_protein / days_count,
        total_carbs=total_carbs,
        avg_carbs=total_carbs / days_count,
        total_fat=total_fat,
        avg_fat=total_fat / days_count,
        total_water_ml=total_water_ml,
        avg_water_ml=total_water_ml // days_count,
    )

    return ReportResponse(
        from_date=from_date,
        to_date=to_date,
        daily=daily_stats,
        summary=summary,
    )