from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.users.models import User
from app.utils.responses import success_response, error_response

from app.custom_foods.schemas import (
    CustomFoodCreate,
    CustomFoodUpdate,
    CustomFoodResponse,
)

from app.custom_foods.service import (
    create_new_custom_food,
    get_user_custom_foods,
    get_custom_food,
    update_existing_custom_food,
    delete_existing_custom_food,
)

router = APIRouter(
    prefix="/custom-foods",
    tags=["Custom Foods"],
)


@router.post("/", response_model=None)
def create_custom_food_endpoint(
    food_data: CustomFoodCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food = create_new_custom_food(db=db, food_data=food_data, user_id=current_user.id)

    return success_response(
        message="Custom food created successfully",
        data=CustomFoodResponse.model_validate(food).model_dump()
    )


@router.get("/", response_model=None)
def get_custom_foods_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    foods = get_user_custom_foods(db=db, user_id=current_user.id)

    return success_response(
        message="Custom foods fetched successfully",
        data=[CustomFoodResponse.model_validate(f).model_dump() for f in foods]
    )


@router.get("/{food_id}", response_model=None)
def get_custom_food_endpoint(
    food_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        food = get_custom_food(db=db, food_id=food_id, user_id=current_user.id)
    except ValueError as e:
        return JSONResponse(status_code=404, content=error_response(message=str(e)))

    return success_response(
        message="Custom food fetched successfully",
        data=CustomFoodResponse.model_validate(food).model_dump()
    )


@router.put("/{food_id}", response_model=None)
def update_custom_food_endpoint(
    food_id: UUID,
    food_data: CustomFoodUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        food = update_existing_custom_food(db=db, food_id=food_id, user_id=current_user.id, food_data=food_data)
    except ValueError as e:
        return JSONResponse(status_code=404, content=error_response(message=str(e)))

    return success_response(
        message="Custom food updated successfully",
        data=CustomFoodResponse.model_validate(food).model_dump()
    )


@router.delete("/{food_id}", response_model=None)
def delete_custom_food_endpoint(
    food_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_existing_custom_food(db=db, food_id=food_id, user_id=current_user.id)
    except ValueError as e:
        return JSONResponse(status_code=404, content=error_response(message=str(e)))

    return success_response(message="Custom food deleted successfully")