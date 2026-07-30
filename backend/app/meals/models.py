from sqlalchemy import Column, String, Date, DateTime, ForeignKey, DECIMAL, Integer, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.database.base import Base


class Meal(Base):
    __tablename__ = "meals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    meal_date = Column(Date, nullable=False, index=True)
    meal_type = Column(String(20), nullable=False)
    original_text = Column(Text, nullable=False)
    total_calories = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_protein = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_carbs = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_fat = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_fiber = Column(DECIMAL(8, 2), nullable=False, default=0)
    total_sugar = Column(DECIMAL(8, 2), nullable=False, default=0)
    ai_provider = Column(String(50), nullable=True)
    ai_model = Column(String(100), nullable=True)
    ai_status = Column(String(20), nullable=False, default="completed")
    processing_time_ms = Column(Integer, nullable=True)
    confidence_score = Column(DECIMAL(5, 2), nullable=True)
    source = Column(String(20), nullable=False, default="manual")
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="meals")
    items = relationship("MealItem", back_populates="meal", cascade="all, delete-orphan")
