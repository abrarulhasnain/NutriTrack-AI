from sqlalchemy.orm import Session
from app.nutrition.models import Food


def search_foods(db: Session, query: str, limit: int = 10):
    return (
        db.query(Food)
        .filter(Food.name.ilike(f"%{query}%"))
        .limit(limit)
        .all()
    )