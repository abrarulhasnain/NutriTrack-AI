from sqlalchemy.orm import Session
from app.nutrition.models import Food


def get_all_foods(db: Session) -> list[Food]:
    """
    Fetches every food item from the reference database.
    Used by the frontend to display food names alongside meal items.
    """
    return db.query(Food).order_by(Food.name).all()
