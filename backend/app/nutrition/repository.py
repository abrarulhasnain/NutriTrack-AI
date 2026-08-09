from sqlalchemy.orm import Session
from app.nutrition.models import Food


def get_all_foods(db: Session):
    return db.query(Food).order_by(Food.name).all()


def search_foods(db: Session, query: str, limit: int = 10):
    return (
        db.query(Food)
        .filter(Food.name.ilike(f"%{query}%"))
        .order_by(Food.name)
        .limit(limit)
        .all()
    )
