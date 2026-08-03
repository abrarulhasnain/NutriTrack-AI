from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from datetime import date

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.meals.service import MealService
from app.meals.schemas import MealCreate, MealResponse
from app.users.models import User
from app.utils.responses import success_response, error_response


router = APIRouter(
    prefix="/meals",
    tags=["Meals"]
)


@router.post("/", response_model=None)
def create_meal(
    payload: MealCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = MealService(db)
    try:
        meal = service.create_meal(current_user.id, payload)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content=error_response(message=str(e))
        )

    return success_response(
        message="Meal logged successfully",
        data=MealResponse.model_validate(meal).model_dump()
    )


@router.get("/", response_model=None)
def get_meals(
    meal_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = MealService(db)
    meals = service.get_meals(current_user.id, meal_date)

    return success_response(
        message="Meals fetched successfully",
        data=[MealResponse.model_validate(m).model_dump() for m in meals]
    )


@router.get("/{meal_id}", response_model=None)
def get_meal(
    meal_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = MealService(db)
    try:
        meal = service.get_meal(meal_id, current_user.id)
    except ValueError as e:
        return JSONResponse(
            status_code=404,
            content=error_response(message=str(e))
        )

    return success_response(
        message="Meal fetched successfully",
        data=MealResponse.model_validate(meal).model_dump()
    )


@router.delete("/{meal_id}", response_model=None)
def delete_meal(
    meal_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = MealService(db)
    try:
        service.delete_meal(meal_id, current_user.id)
    except ValueError as e:
        return JSONResponse(
            status_code=404,
            content=error_response(message=str(e))
        )

    return success_response(message="Meal deleted successfully")