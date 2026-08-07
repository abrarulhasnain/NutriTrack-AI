from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.users.models import User
from app.utils.responses import success_response, error_response

from app.recipes.schemas import (
    RecipeCreate,
    RecipeUpdate,
    RecipeResponse,
)

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
def create_recipe_endpoint(
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        recipe = create_new_recipe(
            db=db,
            recipe_data=recipe_data,
            user_id=current_user.id,
        )
    except ValueError as e:
        return JSONResponse(status_code=400, content=error_response(message=str(e)))

    return success_response(
        message="Recipe created successfully",
        data=RecipeResponse.model_validate(recipe).model_dump(),
    )


@router.get("/", response_model=None)
def get_recipes_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipes = get_user_recipes(
        db=db,
        user_id=current_user.id,
    )

    return success_response(
        message="Recipes fetched successfully",
        data=[
            RecipeResponse.model_validate(recipe).model_dump()
            for recipe in recipes
        ],
    )


@router.get("/{recipe_id}", response_model=None)
def get_recipe_by_id_endpoint(
    recipe_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = get_recipe(
        db=db,
        recipe_id=recipe_id,
        user_id=current_user.id,
    )

    if recipe is None:
        return JSONResponse(status_code=404, content=error_response(message="Recipe not found"))

    return success_response(
        message="Recipe fetched successfully",
        data=RecipeResponse.model_validate(recipe).model_dump(),
    )


@router.put("/{recipe_id}", response_model=None)
def update_recipe_endpoint(
    recipe_id: UUID,
    recipe_data: RecipeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        recipe = update_existing_recipe(
            db=db,
            recipe_id=recipe_id,
            recipe_data=recipe_data,
            user_id=current_user.id,
        )
    except ValueError as e:
        return JSONResponse(status_code=400, content=error_response(message=str(e)))

    if recipe is None:
        return JSONResponse(status_code=404, content=error_response(message="Recipe not found"))

    return success_response(
        message="Recipe updated successfully",
        data=RecipeResponse.model_validate(recipe).model_dump(),
    )


@router.delete("/{recipe_id}", response_model=None)
def delete_recipe_endpoint(
    recipe_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = delete_existing_recipe(
        db=db,
        recipe_id=recipe_id,
        user_id=current_user.id,
    )

    if not deleted:
        return JSONResponse(status_code=404, content=error_response(message="Recipe not found"))

    return success_response(
        message="Recipe deleted successfully",
    )