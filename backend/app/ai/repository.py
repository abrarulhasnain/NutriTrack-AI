import re
from difflib import SequenceMatcher
from uuid import UUID
from sqlalchemy.orm import Session
from app.nutrition.models import Food
from app.custom_foods.models import CustomFood


def tokenize(name: str) -> set[str]:
    """
    Breaks a food name into a set of normalized words: lowercase,
    punctuation removed, simple plural stripping (eggs -> egg).
    """
    cleaned = re.sub(r"[^\w\s]", " ", name.lower())
    words = cleaned.split()
    normalized = {w[:-1] if w.endswith("s") and len(w) > 3 else w for w in words}
    return normalized


def calculate_similarity(name_a: str, name_b: str) -> float:
    """
    Word-based similarity score between 0 and 1.
    Primarily checks how many words overlap (relative to the shorter
    name), so a short query like "rice" scores well against a longer
    database name like "White rice (cooked)" instead of being penalized
    for the length difference, as plain character comparison would do.
    Character-level similarity is used only as a secondary tiebreaker.
    """
    words_a = tokenize(name_a)
    words_b = tokenize(name_b)
    if not words_a or not words_b:
        return 0.0
    common_words = words_a & words_b
    word_overlap_score = len(common_words) / min(len(words_a), len(words_b))
    char_score = SequenceMatcher(
        None, " ".join(sorted(words_a)), " ".join(sorted(words_b))
    ).ratio()
    return round((0.7 * word_overlap_score) + (0.3 * char_score), 4)


def find_best_matching_food(db: Session, extracted_name: str, user_id: UUID):
    """
    Searches both the shared reference foods table and the user's own
    custom foods, and returns the closest match for the given extracted
    food name, along with a confidence score and which table it came from.

    Returns (food_object, score, "food" | "custom_food") or (None, 0.0, None)
    if nothing is found.
    """
    all_foods = db.query(Food).all()
    all_custom_foods = db.query(CustomFood).filter(CustomFood.user_id == user_id).all()

    best_match = None
    best_score = 0.0
    best_source = None

    for food in all_foods:
        score = calculate_similarity(extracted_name, food.name)
        if score > best_score:
            best_score = score
            best_match = food
            best_source = "food"

    for custom_food in all_custom_foods:
        score = calculate_similarity(extracted_name, custom_food.name)
        if score > best_score:
            best_score = score
            best_match = custom_food
            best_source = "custom_food"

    return best_match, best_score, best_source
