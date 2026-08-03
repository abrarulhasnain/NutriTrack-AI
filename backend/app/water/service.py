from uuid import UUID
from datetime import date as date_type
from sqlalchemy.orm import Session
from app.water.repository import (
    create_water_log,
    get_all_water_logs,
    get_water_log_by_id,
    get_total_for_date,
    delete_water_log,
)
from app.water.schemas import WaterLogCreate


def log_water(db: Session, log_data: WaterLogCreate, user_id: UUID):
    return create_water_log(db, log_data, user_id)


def get_user_water_logs(db: Session, user_id: UUID, log_date: date_type = None):
    return get_all_water_logs(db, user_id, log_date)


def get_daily_total(db: Session, user_id: UUID, log_date: date_type):
    total_ml = get_total_for_date(db, user_id, log_date)
    return {"date": log_date, "total_ml": total_ml}


def delete_existing_water_log(db: Session, log_id: UUID, user_id: UUID):
    log = get_water_log_by_id(db, log_id, user_id)
    if not log:
        raise ValueError("Water log not found")
    delete_water_log(db, log)