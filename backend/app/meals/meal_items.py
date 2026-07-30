from sqlalchemy import Column, String, ForeignKey, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.database.base import Base


class MealItem(Base):
    __tablename__ = "meal_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_id = Column(UUID(as_uuid=True), ForeignKey("meals.id", ondelete="CASCADE"), nullable=False, index=True)
    food_id = Column(UUID(as_uuid=True), ForeignKey("foods.id", ondelete="RESTRICT"), nullable=True)
    custom_food_id = Column(UUID(as_uuid=True), ForeignKey("custom_foods.id", ondelete="RESTRICT"), nullable=True)
    quantity = Column(DECIMAL(8, 2), nullable=False)
    unit = Column(String(30), nullable=False)
    calories = Column(DECIMAL(8, 2), nullable=False)
    protein = Column(DECIMAL(8, 2), nullable=False)
    carbs = Column(DECIMAL(8, 2), nullable=False)
    fat = Column(DECIMAL(8, 2), nullable=False)
    fiber = Column(DECIMAL(8, 2), nullable=False)
    sugar = Column(DECIMAL(8, 2), nullable=False)

    meal = relationship("Meal", back_populates="items")
    food = relationship("Food")
    custom_food = relationship("CustomFood")
