from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.users.models import User
from app.utils.responses import success_response, error_response

from app.dashboard.schemas import DashboardResponse
from app.dashboard.service import build_dashboard

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/", response_model=None)
def get_dashboard_endpoint(
    target_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns a combined summary for the given date (defaults to today):
    calories/macros/water consumed vs goals, plus the list of meals logged.
    """
    query_date = target_date or date.today()

    try:
        dashboard = build_dashboard(db=db, user_id=current_user.id, target_date=query_date)
    except ValueError as e:
        return JSONResponse(status_code=404, content=error_response(message=str(e)))

    return success_response(
        message="Dashboard fetched successfully",
        data=dashboard.model_dump()
    )