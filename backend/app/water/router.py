from uuid import UUID
from datetime import date

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.users.models import User
from app.utils.responses import success_response, error_response

from app.water.schemas import WaterLogCreate, WaterLogResponse, WaterTotalResponse

from app.water.service import (
    log_water,
    get_user_water_logs,
    get_daily_total,
    delete_existing_water_log,
)

router = APIRouter(
    prefix="/water",
    tags=["Water"],
)


@router.post("/", response_model=None)
def create_water_log_endpoint(
    log_data: WaterLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = log_water(db=db, log_data=log_data, user_id=current_user.id)

    return success_response(
        message="Water log created successfully",
        data=WaterLogResponse.model_validate(log).model_dump()
    )


@router.get("/", response_model=None)
def get_water_logs_endpoint(
    log_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logs = get_user_water_logs(db=db, user_id=current_user.id, log_date=log_date)

    return success_response(
        message="Water logs fetched successfully",
        data=[WaterLogResponse.model_validate(l).model_dump() for l in logs]
    )


@router.get("/total", response_model=None)
def get_water_total_endpoint(
    log_date: date,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = get_daily_total(db=db, user_id=current_user.id, log_date=log_date)

    return success_response(
        message="Total water intake fetched successfully",
        data=WaterTotalResponse(**result).model_dump()
    )


@router.delete("/{log_id}", response_model=None)
def delete_water_log_endpoint(
    log_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_existing_water_log(db=db, log_id=log_id, user_id=current_user.id)
    except ValueError as e:
        return JSONResponse(status_code=404, content=error_response(message=str(e)))

    return success_response(message="Water log deleted successfully")