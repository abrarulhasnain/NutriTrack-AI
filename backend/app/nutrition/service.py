from sqlalchemy.orm import Session
from app.nutrition.repository import search_foods


def search_foods_by_name(db: Session, query: str):
    if not query or len(query.strip()) < 2:
        return []
    return search_foods(db, query.strip())