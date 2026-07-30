from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database.base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    full_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    height_cm = Column(DECIMAL(5, 2), nullable=False)
    weight_kg = Column(DECIMAL(5, 2), nullable=False)
    activity_level = Column(String(50), nullable=False)
    fitness_goal = Column(String(50), nullable=False)
    calorie_goal = Column(Integer, nullable=False)
    protein_goal = Column(DECIMAL(6, 2), nullable=False)
    carbs_goal = Column(DECIMAL(6, 2), nullable=False)
    fat_goal = Column(DECIMAL(6, 2), nullable=False)
    water_goal = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")
