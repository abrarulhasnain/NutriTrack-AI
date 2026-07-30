from sqlalchemy import Column, String, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database.base import Base


class Food(Base):
    __tablename__ = "foods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, index=True)
    serving_size = Column(DECIMAL(8, 2), nullable=False)
    serving_unit = Column(String(30), nullable=False)
    calories = Column(DECIMAL(8, 2), nullable=False)
    protein = Column(DECIMAL(8, 2), nullable=False)
    carbs = Column(DECIMAL(8, 2), nullable=False)
    fat = Column(DECIMAL(8, 2), nullable=False)
    fiber = Column(DECIMAL(8, 2), nullable=False)
    sugar = Column(DECIMAL(8, 2), nullable=False)
