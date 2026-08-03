from sqlalchemy.orm import Session
from app.custom_foods.models import CustomFood
from app.custom_foods.schemas import CustomFoodCreate, CustomFoodUpdate
from uuid import UUID


def create_custom_food(db: Session, food_data: CustomFoodCreate, user_id: UUID):
    food = CustomFood(
        user_id=user_id,
        name=food_data.name,
        serving_size=food_data.serving_size,
        serving_unit=food_data.serving_unit,
        calories=food_data.calories,
        protein=food_data.protein,
        carbs=food_data.carbs,
        fat=food_data.fat,
        fiber=food_data.fiber,
        sugar=food_data.sugar,
    )

    db.add(food)
    db.commit()
    db.refresh(food)

    return food


def get_all_custom_foods(db: Session, user_id: UUID):
    return (
        db.query(CustomFood)
        .filter(CustomFood.user_id == user_id)
        .order_by(CustomFood.created_at.desc())
        .all()
    )


def get_custom_food_by_id(db: Session, food_id: UUID, user_id: UUID):
    return (
        db.query(CustomFood)
        .filter(
            CustomFood.id == food_id,
            CustomFood.user_id == user_id,
        )
        .first()
    )


def update_custom_food(db: Session, food: CustomFood, food_data: CustomFoodUpdate):
    update_data = food_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(food, key, value)

    db.commit()
    db.refresh(food)

    return food


def delete_custom_food(db: Session, food: CustomFood):
    db.delete(food)
    db.commit()