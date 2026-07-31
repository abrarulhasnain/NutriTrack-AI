from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.users.models import User

from app.recipes.schemas import (
    RecipeCreate,
    RecipeResponse,
)

from app.recipes.service import (
    create_new_recipe,
    get_user_recipes,
    get_recipe,
)

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"],
)

@router.post("/", response_model=RecipeResponse)
def create_recipe(
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
   
   return create_new_recipe(
    db=db,
    recipe_data=recipe_data,
    user_id=current_user.id,
)
@router.get("/", response_model=list[RecipeResponse])
def get_recipes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
   
   return get_user_recipes(
    db=db,
    user_id=current_user.id,
)
@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe_by_id(
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
        raise HTTPException(
            status_code=404,
            detail="Recipe not found",
        )

    return recipe