from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.users.models import User
from app.utils.responses import success_response

from app.reports.service import build_report

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/", response_model=None)
def get_report_endpoint(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns a nutrition report for the given date range (defaults to
    the last 7 days if not provided): daily breakdown plus totals/averages.
    """
    report = build_report(db=db, user_id=current_user.id, from_date=from_date, to_date=to_date)

    return success_response(
        message="Report fetched successfully",
        data=report.model_dump()
    )