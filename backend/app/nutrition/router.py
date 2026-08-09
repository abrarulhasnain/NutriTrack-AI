from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.nutrition.schemas import FoodResponse
from app.nutrition.service import get_all_foods
from app.utils.responses import success_response

router = APIRouter(prefix="/foods", tags=["Foods"])


@router.get("/", response_model=None)
def get_foods_endpoint(db: Session = Depends(get_db)):
    """
    Returns the full list of reference foods. Intended to be fetched once
    and cached on the frontend for looking up food names by ID.
    """
    foods = get_all_foods(db=db)
    return success_response(
        message="Foods fetched successfully",
        data=[FoodResponse.model_validate(f).model_dump() for f in foods],
    )
