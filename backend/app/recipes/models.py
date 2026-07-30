from sqlalchemy import Column, String, DateTime, ForeignKey, DECIMAL, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.database.base import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    servings = Column(Integer, nullable=False, default=1)
    total_calories = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_protein = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_carbs = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_fat = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_fiber = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_sugar = Column(DECIMAL(8, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="recipes")
    items = relationship("RecipeItem", back_populates="recipe", cascade="all, delete-orphan")


class RecipeItem(Base):
    __tablename__ = "recipe_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipe_id = Column(UUID(as_uuid=True), ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    food_id = Column(UUID(as_uuid=True), ForeignKey("foods.id", ondelete="RESTRICT"), nullable=True)
    custom_food_id = Column(UUID(as_uuid=True), ForeignKey("custom_foods.id", ondelete="RESTRICT"), nullable=True)
    quantity = Column(DECIMAL(8, 2), nullable=False)
    unit = Column(String(30), nullable=False)

    recipe = relationship("Recipe", back_populates="items")
    food = relationship("Food")
    custom_food = relationship("CustomFood")
