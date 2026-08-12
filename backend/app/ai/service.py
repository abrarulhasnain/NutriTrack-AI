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
from app.custom_foods.models import CustomFood


client = Groq(api_key=settings.groq_api_key)

# If the matching score is at or above this value, we trust it enough
# to auto-create the meal without asking the user to confirm.
MATCH_CONFIDENCE_THRESHOLD = 0.75


def extract_food_items(text: str, custom_food_names: list[str]) -> list[ExtractedItem]:
    """
    Sends user's food description to Groq and asks it to
    identify individual food items with quantity and unit.

    IMPORTANT: This function ONLY identifies food items.
    It does NOT calculate nutrition - that is the Nutrition Engine's job.

    If the user has custom foods saved, their exact names are included in
    the prompt so the AI preserves them verbatim instead of generalizing
    them into a generic term (e.g. keeping "Mama's Special Daal" instead
    of normalizing it down to "lentils").
    """

    prompt = FOOD_EXTRACTION_PROMPT
    if custom_food_names:
        names_list = ", ".join(f'"{name}"' for name in custom_food_names)
        prompt += f"""

The user also has these custom foods saved in their account: {names_list}.
If the text refers to one of these (even partially, informally, or with typos),
use that EXACT name in your output verbatim instead of generalizing it.
Only fall back to normal translation/normalization rules for foods that do
not match any of these custom food names."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": prompt},
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
    1. Extract raw food items from text using the AI model, aware of the
       user's custom foods so personal/branded names aren't over-generalized.
    2. Match each item against both the shared foods table and the
       user's own custom foods.
    3. If every item has a confident match, auto-create the meal.
    4. Otherwise, return the items so the user can confirm/select manually.
    """

    custom_food_names = [
        cf.name for cf in db.query(CustomFood).filter(CustomFood.user_id == user_id).all()
    ]

    extracted_items = extract_food_items(payload.text, custom_food_names)

    matched_items: list[MatchedItem] = []

    for item in extracted_items:
        match, score, source = find_best_matching_food(db, item.name, user_id)

        units_match = match is not None and item.unit.strip().lower() == match.serving_unit.strip().lower()
        is_confident = match is not None and score >= MATCH_CONFIDENCE_THRESHOLD and units_match

        matched_items.append(
            MatchedItem(
                extracted_name=item.name,
                quantity=item.quantity,
                unit=item.unit,
                food_id=match.id if match and source == "food" else None,
                custom_food_id=match.id if match and source == "custom_food" else None,
                matched_food_name=match.name if match else None,
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
                custom_food_id=item.custom_food_id,
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


def generate_meal_suggestion(db: Session, user_id) -> str:
    """
    Looks at the user's remaining calories and macros for today and asks
    the AI model for a single, simple meal or snack suggestion.
    """
    from app.dashboard.service import build_dashboard
    from app.ai.prompts.meal_suggestion_prompt import MEAL_SUGGESTION_PROMPT

    dashboard = build_dashboard(db=db, user_id=user_id, target_date=date.today())

    remaining_calories = dashboard.calories.goal - dashboard.calories.consumed
    remaining_protein = dashboard.protein.goal - dashboard.protein.consumed
    remaining_carbs = dashboard.carbs.goal - dashboard.carbs.consumed
    remaining_fat = dashboard.fat.goal - dashboard.fat.consumed

    prompt = MEAL_SUGGESTION_PROMPT.format(
        remaining_calories=remaining_calories,
        remaining_protein=remaining_protein,
        remaining_carbs=remaining_carbs,
        remaining_fat=remaining_fat,
    )

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7,
        )
    except Exception:
        raise ValueError("AI service is currently unavailable, please try again later")

    return response.choices[0].message.content.strip()
