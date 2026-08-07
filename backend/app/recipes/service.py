from uuid import UUID
from sqlalchemy.orm import Session
from app.recipes.repository import (
    get_food_by_id,
    get_custom_food_by_id,
    create_recipe,
    get_all_recipes,
    get_recipe_by_id,
    replace_recipe_items,
    save_recipe,
    delete_recipe,
)
from app.recipes.models import Recipe, RecipeItem
from app.recipes.schemas import RecipeCreate, RecipeUpdate


def _build_items_and_totals(db: Session, items_data):
    recipe_items = []
    totals = {
        "calories": 0, "protein": 0, "carbs": 0,
        "fat": 0, "fiber": 0, "sugar": 0
    }

    for item in items_data:

        if not item.food_id and not item.custom_food_id:
            raise ValueError("Each item must have either food_id or custom_food_id")

        if item.food_id and item.custom_food_id:
            raise ValueError("An item cannot have both food_id and custom_food_id")

        if item.food_id:
            food = get_food_by_id(db, item.food_id)
            if not food:
                raise ValueError(f"Food id {item.food_id} not found")
        else:
            food = get_custom_food_by_id(db, item.custom_food_id)
            if not food:
                raise ValueError(f"Custom food id {item.custom_food_id} not found")

        scale = item.quantity / food.serving_size

        totals["calories"] += food.calories * scale
        totals["protein"] += food.protein * scale
        totals["carbs"] += food.carbs * scale
        totals["fat"] += food.fat * scale
        totals["fiber"] += food.fiber * scale
        totals["sugar"] += food.sugar * scale

        recipe_items.append(RecipeItem(
            food_id=item.food_id,
            custom_food_id=item.custom_food_id,
            quantity=item.quantity,
            unit=item.unit,
        ))

    return recipe_items, totals


def create_new_recipe(db: Session, recipe_data: RecipeCreate, user_id: UUID) -> Recipe:
    items, totals = _build_items_and_totals(db, recipe_data.items)

    recipe = Recipe(
        user_id=user_id,
        name=recipe_data.name,
        description=recipe_data.description,
        servings=recipe_data.servings,
        total_calories=totals["calories"],
        total_protein=totals["protein"],
        total_carbs=totals["carbs"],
        total_fat=totals["fat"],
        total_fiber=totals["fiber"],
        total_sugar=totals["sugar"],
        items=items,
    )

    return create_recipe(db, recipe)


def get_user_recipes(db: Session, user_id: UUID) -> list[Recipe]:
    return get_all_recipes(db, user_id)


def get_recipe(db: Session, recipe_id: UUID, user_id: UUID) -> Recipe | None:
    return get_recipe_by_id(db, recipe_id, user_id)


def update_existing_recipe(db: Session, recipe_id: UUID, recipe_data: RecipeUpdate, user_id: UUID) -> Recipe | None:
    recipe = get_recipe_by_id(db, recipe_id, user_id)
    if recipe is None:
        return None

    if recipe_data.name is not None:
        recipe.name = recipe_data.name
    if recipe_data.description is not None:
        recipe.description = recipe_data.description
    if recipe_data.servings is not None:
        recipe.servings = recipe_data.servings

    if recipe_data.items is not None:
        items, totals = _build_items_and_totals(db, recipe_data.items)
        recipe.total_calories = totals["calories"]
        recipe.total_protein = totals["protein"]
        recipe.total_carbs = totals["carbs"]
        recipe.total_fat = totals["fat"]
        recipe.total_fiber = totals["fiber"]
        recipe.total_sugar = totals["sugar"]
        replace_recipe_items(db, recipe, items)

    return save_recipe(db, recipe)


def delete_existing_recipe(db: Session, recipe_id: UUID, user_id: UUID) -> bool:
    recipe = get_recipe_by_id(db, recipe_id, user_id)
    if recipe is None:
        return False
    delete_recipe(db, recipe)
    return True