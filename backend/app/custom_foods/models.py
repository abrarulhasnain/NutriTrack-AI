from sqlalchemy import Column, String, DateTime, ForeignKey, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.database.base import Base


class CustomFood(Base):
    __tablename__ = "custom_foods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=False)
    serving_size = Column(DECIMAL(8, 2), nullable=False)
    serving_unit = Column(String(30), nullable=False)
    calories = Column(DECIMAL(8, 2), nullable=False)
    protein = Column(DECIMAL(8, 2), nullable=False)
    carbs = Column(DECIMAL(8, 2), nullable=False)
    fat = Column(DECIMAL(8, 2), nullable=False)
    fiber = Column(DECIMAL(8, 2), nullable=False)
    sugar = Column(DECIMAL(8, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="custom_foods")
