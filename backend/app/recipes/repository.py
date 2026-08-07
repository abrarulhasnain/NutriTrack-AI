from sqlalchemy.orm import Session, joinedload
from app.recipes.models import Recipe, RecipeItem
from app.nutrition.models import Food
from app.custom_foods.models import CustomFood
from uuid import UUID


def get_food_by_id(db: Session, food_id: UUID):
    return db.query(Food).filter(Food.id == food_id).first()


def get_custom_food_by_id(db: Session, custom_food_id: UUID):
    return db.query(CustomFood).filter(CustomFood.id == custom_food_id).first()


def create_recipe(db: Session, recipe: Recipe):
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


def get_all_recipes(db: Session, user_id: UUID):
    return (
        db.query(Recipe)
        .options(joinedload(Recipe.items))
        .filter(Recipe.user_id == user_id)
        .order_by(Recipe.created_at.desc())
        .all()
    )


def get_recipe_by_id(db: Session, recipe_id: UUID, user_id: UUID):
    return (
        db.query(Recipe)
        .options(joinedload(Recipe.items))
        .filter(
            Recipe.id == recipe_id,
            Recipe.user_id == user_id,
        )
        .first()
    )


def replace_recipe_items(db: Session, recipe: Recipe, new_items: list[RecipeItem]):
    for old_item in recipe.items:
        db.delete(old_item)
    recipe.items = new_items


def save_recipe(db: Session, recipe: Recipe):
    db.commit()
    db.refresh(recipe)
    return recipe


def delete_recipe(db: Session, recipe: Recipe):
    db.delete(recipe)
    db.commit()