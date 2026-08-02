from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.users.models import User
from app.utils.responses import success_response, error_response

from app.recipes.schemas import RecipeCreate, RecipeResponse

from app.recipes.service import (
    create_new_recipe,
    get_user_recipes,
    get_recipe,
    update_existing_recipe,
    delete_existing_recipe,
)

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"],
)


@router.post("/", response_model=None)
def create_recipe(
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        recipe = create_new_recipe(db=db, recipe_data=recipe_data, user_id=current_user.id)
    except ValueError as e:
        # Invalid or missing food references in the request body
        return JSONResponse(status_code=400, content=error_response(message=str(e)))

    return success_response(
        message="Recipe created successfully",
        data=RecipeResponse.model_validate(recipe).model_dump()
    )


@router.get("/", response_model=None)
def get_recipes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipes = get_user_recipes(db=db, user_id=current_user.id)
    return success_response(
        message="Recipes fetched successfully",
        data=[RecipeResponse.model_validate(r).model_dump() for r in recipes]
    )


@router.get("/{recipe_id}", response_model=None)
def get_recipe_by_id(
    recipe_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        recipe = get_recipe(db=db, recipe_id=recipe_id, user_id=current_user.id)
    except ValueError as e:
        # Requested recipe does not exist for this user
        return JSONResponse(status_code=404, content=error_response(message=str(e)))

    return success_response(
        message="Recipe fetched successfully",
        data=RecipeResponse.model_validate(recipe).model_dump()
    )


@router.put("/{recipe_id}", response_model=None)
def update_recipe(
    recipe_id: UUID,
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        recipe = update_existing_recipe(db=db, recipe_id=recipe_id, user_id=current_user.id, recipe_data=recipe_data)
    except ValueError as e:
        # 404 if the recipe itself is missing, 400 for invalid item data
        status = 404 if "not found" in str(e) and "id" not in str(e) else 400
        return JSONResponse(status_code=status, content=error_response(message=str(e)))

    return success_response(
        message="Recipe updated successfully",
        data=RecipeResponse.model_validate(recipe).model_dump()
    )


@router.delete("/{recipe_id}", response_model=None)
def delete_recipe(
    recipe_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_existing_recipe(db=db, recipe_id=recipe_id, user_id=current_user.id)
    except ValueError as e:
        return JSONResponse(status_code=404, content=error_response(message=str(e)))

    return success_response(message="Recipe deleted successfully")