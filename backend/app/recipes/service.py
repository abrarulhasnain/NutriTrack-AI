from uuid import UUID
from sqlalchemy.orm import Session
from app.recipes.repository import (
    create_recipe,
    get_all_recipes,
    get_recipe_by_id,
)
from app.recipes.schemas import RecipeCreate

def create_new_recipe(
    db: Session,
    recipe_data: RecipeCreate,
    user_id: UUID,
):
    """
    Creates a new recipe by delegating the database operation
    to the repository layer.
    """
    return create_recipe(
        db=db,
        recipe_data=recipe_data,
        user_id=user_id,
    )
def get_user_recipes(
    db: Session,
    user_id: UUID,
):
    """
    Returns all recipes belonging to a user.
    """
    return get_all_recipes(
        db=db,
        user_id=user_id,
    )
def get_recipe(
    db: Session,
    recipe_id: UUID,
    user_id: UUID,
):
    """
    Returns a single recipe belonging to the logged-in user.
    """
    return get_recipe_by_id(
        db=db,
        recipe_id=recipe_id,
        user_id=user_id,
    )