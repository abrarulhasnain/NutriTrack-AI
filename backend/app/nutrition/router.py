from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.users.models import User
from app.utils.responses import success_response

from app.nutrition.schemas import FoodResponse
from app.nutrition.service import search_foods_by_name

router = APIRouter(
    prefix="/foods",
    tags=["Foods"],
)


@router.get("/", response_model=None)
def search_foods_endpoint(
    search: str = Query(default="", description="Search food by name"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    foods = search_foods_by_name(db, search)

    return success_response(
        message="Foods fetched successfully",
        data=[FoodResponse.model_validate(f).model_dump() for f in foods],
    )