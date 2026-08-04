from datetime import date
from decimal import Decimal
from pydantic import BaseModel


# A single day's totals (used for daily breakdown / charting on frontend)
class DailyStat(BaseModel):
    date: date
    calories: Decimal
    protein: Decimal
    carbs: Decimal
    fat: Decimal
    water_ml: int


# Averages and totals across the whole date range
class ReportSummary(BaseModel):
    days_count: int
    total_calories: Decimal
    avg_calories: Decimal
    total_protein: Decimal
    avg_protein: Decimal
    total_carbs: Decimal
    avg_carbs: Decimal
    total_fat: Decimal
    avg_fat: Decimal
    total_water_ml: int
    avg_water_ml: int


# Full report response
class ReportResponse(BaseModel):
    from_date: date
    to_date: date
    daily: list[DailyStat]
    summary: ReportSummary