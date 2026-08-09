from sqlalchemy.orm import Session
from app.nutrition.repository import get_all_foods, search_foods


def get_foods(db: Session, search: str = ""):
    """
    Returns foods matching the search query, or the full reference list
    if no search term is provided (used by the frontend for local caching).
    """
    if search and len(search.strip()) >= 2:
        return search_foods(db, search.strip())
    return get_all_foods(db)
