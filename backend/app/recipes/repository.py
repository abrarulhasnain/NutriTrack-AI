from uuid import UUID

from sqlalchemy.orm import Session

from app.recipes.models import Recipe
from app.recipes.schemas import RecipeCreate, RecipeUpdate

def create_recipe(db: Session, recipe_data: RecipeCreate, user_id: UUID):
    recipe = Recipe(
        user_id=user_id,
        name=recipe_data.name,
        description=recipe_data.description,
        servings=recipe_data.servings,
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    return recipe

def get_all_recipes(db: Session, user_id: UUID):
    return (
        db.query(Recipe)
        .filter(Recipe.user_id == user_id)
        .order_by(Recipe.created_at.desc())
        .all()
    )
def get_recipe_by_id(
    db: Session,
    recipe_id: UUID,
    user_id: UUID,
):
    return (
        db.query(Recipe)
        .filter(
            Recipe.id == recipe_id,
            Recipe.user_id == user_id,
        )
        .first()
    )
def update_recipe(
    db: Session,
    recipe: Recipe,
    recipe_data: RecipeUpdate,
):
    if recipe_data.name is not None:
        recipe.name = recipe_data.name

    if recipe_data.description is not None:
        recipe.description = recipe_data.description

    if recipe_data.servings is not None:
        recipe.servings = recipe_data.servings

    db.commit()
    db.refresh(recipe)

    return recipe


def delete_recipe(
    db: Session,
    recipe: Recipe,
) -> None:
    db.delete(recipe)
    db.commit()