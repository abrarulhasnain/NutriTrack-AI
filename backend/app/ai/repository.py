import re
from difflib import SequenceMatcher
from sqlalchemy.orm import Session

from app.nutrition.models import Food


def normalize_food_name(name: str) -> str:
    """
    Cleans a food name for comparison: lowercase, removes punctuation,
    and sorts words alphabetically so word order does not affect matching.
    e.g. "Egg (boiled)" and "boiled egg" both become "boiled egg"
    """
    cleaned = re.sub(r"[^\w\s]", " ", name.lower())
    words = sorted(cleaned.split())
    return " ".join(words)


def calculate_similarity(name_a: str, name_b: str) -> float:
    """
    Returns a similarity score between 0 and 1 for two food names,
    after normalizing both so word order/punctuation does not matter.
    """
    normalized_a = normalize_food_name(name_a)
    normalized_b = normalize_food_name(name_b)
    return SequenceMatcher(None, normalized_a, normalized_b).ratio()


def find_best_matching_food(db: Session, extracted_name: str) -> tuple[Food | None, float]:
    """
    Searches all foods in the database and returns the closest match
    for the given extracted food name, along with a confidence score.

    Returns (None, 0.0) if the foods table is empty.
    """
    all_foods = db.query(Food).all()

    best_food = None
    best_score = 0.0

    for food in all_foods:
        score = calculate_similarity(extracted_name, food.name)
        if score > best_score:
            best_score = score
            best_food = food

    return best_food, best_score