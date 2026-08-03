from uuid import UUID
from sqlalchemy.orm import Session
from app.custom_foods.repository import (
    create_custom_food,
    get_all_custom_foods,
    get_custom_food_by_id,
    update_custom_food,
    delete_custom_food,
)
from app.custom_foods.schemas import CustomFoodCreate, CustomFoodUpdate


def create_new_custom_food(db: Session, food_data: CustomFoodCreate, user_id: UUID):
    return create_custom_food(db, food_data, user_id)


def get_user_custom_foods(db: Session, user_id: UUID):
    return get_all_custom_foods(db, user_id)


def get_custom_food(db: Session, food_id: UUID, user_id: UUID):
    food = get_custom_food_by_id(db, food_id, user_id)
    if not food:
        raise ValueError("Custom food not found")
    return food


def update_existing_custom_food(db: Session, food_id: UUID, user_id: UUID, food_data: CustomFoodUpdate):
    food = get_custom_food_by_id(db, food_id, user_id)
    if not food:
        raise ValueError("Custom food not found")
    return update_custom_food(db, food, food_data)


def delete_existing_custom_food(db: Session, food_id: UUID, user_id: UUID):
    food = get_custom_food_by_id(db, food_id, user_id)
    if not food:
        raise ValueError("Custom food not found")
    delete_custom_food(db, food)