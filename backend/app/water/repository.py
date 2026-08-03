from sqlalchemy.orm import Session
from sqlalchemy import func
from app.water.models import WaterLog
from app.water.schemas import WaterLogCreate
from uuid import UUID
from datetime import date as date_type


def create_water_log(db: Session, log_data: WaterLogCreate, user_id: UUID):
    log = WaterLog(
        user_id=user_id,
        date=log_data.date,
        amount_ml=log_data.amount_ml,
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def get_all_water_logs(db: Session, user_id: UUID, log_date: date_type = None):
    query = db.query(WaterLog).filter(WaterLog.user_id == user_id)

    if log_date:
        query = query.filter(WaterLog.date == log_date)

    return query.order_by(WaterLog.created_at.desc()).all()


def get_water_log_by_id(db: Session, log_id: UUID, user_id: UUID):
    return (
        db.query(WaterLog)
        .filter(
            WaterLog.id == log_id,
            WaterLog.user_id == user_id,
        )
        .first()
    )


def get_total_for_date(db: Session, user_id: UUID, log_date: date_type):
    total = (
        db.query(func.sum(WaterLog.amount_ml))
        .filter(
            WaterLog.user_id == user_id,
            WaterLog.date == log_date,
        )
        .scalar()
    )

    return total or 0


def delete_water_log(db: Session, log: WaterLog):
    db.delete(log)
    db.commit()