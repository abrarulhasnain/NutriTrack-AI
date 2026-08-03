import json
from decimal import Decimal
from datetime import date
from groq import Groq
from sqlalchemy.orm import Session
from app.core.config import settings

from app.ai.schemas import ExtractedItem, AIExtractRequest, AIExtractResponse, MatchedItem
from app.ai.prompts.food_extraction_prompt import FOOD_EXTRACTION_PROMPT
from app.ai.repository import find_best_matching_food
from app.meals.service import MealService
from app.meals.schemas import MealCreate, MealItemCreate


client = Groq(api_key=settings.groq_api_key)

# If the matching score is at or above this value, we trust it enough
# to auto-create the meal without asking the user to confirm.
MATCH_CONFIDENCE_THRESHOLD = 0.75


def extract_food_items(text: str) -> list[ExtractedItem]:
    """
    Sends user's food description to Groq and asks it to
    identify individual food items with quantity and unit.

    IMPORTANT: This function ONLY identifies food items.
    It does NOT calculate nutrition - that is the Nutrition Engine's job.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": FOOD_EXTRACTION_PROMPT},
                {"role": "user", "content": text}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
    except Exception:
        raise ValueError("AI service is currently unavailable, please try again later")

    raw_content = response.choices[0].message.content

    try:
        parsed = json.loads(raw_content)
        extracted_items = [ExtractedItem(**item) for item in parsed["items"]]
    except (json.JSONDecodeError, KeyError, TypeError):
        raise ValueError("Could not understand the food items in the text, please rephrase and try again")

    if not extracted_items:
        raise ValueError("No food items could be identified from the text")

    return extracted_items


def process_ai_extraction(db: Session, user_id, payload: AIExtractRequest) -> AIExtractResponse:
    """
    Full AI pipeline:
    1. Extract raw food items from text using the AI model.
    2. Match each item against the foods table.
    3. If every item has a confident match, auto-create the meal.
    4. Otherwise, return the items so the user can confirm/select manually.
    """

    extracted_items = extract_food_items(payload.text)

    matched_items: list[MatchedItem] = []

    for item in extracted_items:
        food, score = find_best_matching_food(db, item.name)

        is_confident = food is not None and score >= MATCH_CONFIDENCE_THRESHOLD

        matched_items.append(
            MatchedItem(
                extracted_name=item.name,
                quantity=item.quantity,
                unit=item.unit,
                food_id=food.id if food else None,
                matched_food_name=food.name if food else None,
                confidence=score,
                matched=is_confident,
            )
        )

    all_matched = len(matched_items) > 0 and all(item.matched for item in matched_items)

    meal_created = False
    meal_id = None

    if all_matched:
        meal_items_payload = [
            MealItemCreate(
                food_id=item.food_id,
                quantity=Decimal(str(item.quantity)),
                unit=item.unit,
            )
            for item in matched_items
        ]

        meal_payload = MealCreate(
            meal_date=payload.log_date or date.today(),
            meal_type=payload.meal_type,
            original_text=payload.text,
            items=meal_items_payload,
        )

        meal_service = MealService(db)
        created_meal = meal_service.create_meal(user_id, meal_payload)

        meal_created = True
        meal_id = created_meal.id

    return AIExtractResponse(
        items=matched_items,
        meal_created=meal_created,
        meal_id=meal_id,
    )