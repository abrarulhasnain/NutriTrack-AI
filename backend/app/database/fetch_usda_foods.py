import requests
from app.database.session import SessionLocal
from app.nutrition.models import Food
from app.core.config import settings

USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1"

# Search terms - generic/raw foods, verified data available on USDA
# Note: no parentheses in terms, USDA search doesn't handle them well
SEARCH_TERMS = [
    # ---- Meat / Poultry / Seafood ----
    "chicken thigh", "chicken wing", "chicken drumstick", "turkey breast", "turkey ground",
    "duck", "lamb", "lamb chop", "pork chop", "bacon", "ham", "goat meat",
    "trout", "sardine canned", "crab", "lobster", "tuna canned", "mackerel", "cod raw",
    "anchovy", "squid", "mussels", "oysters", "catfish", "haddock",

    # ---- Grains / Starches ----
    "quinoa cooked", "barley cooked", "couscous cooked", "millet cooked", "buckwheat cooked",
    "cornmeal cooked", "bulgur cooked", "rye bread", "sourdough bread", "bagel",
    "tortilla flour", "tortilla corn", "rice noodles", "vermicelli",

    # ---- Legumes ----
    "lentils cooked", "black beans cooked", "pinto beans cooked", "navy beans cooked",
    "lima beans cooked", "split peas cooked", "soybeans cooked", "edamame",

    # ---- Vegetables ----
    "cabbage", "zucchini", "eggplant", "asparagus", "beets", "sweet potato cooked",
    "green beans", "brussels sprouts", "kale raw", "celery", "radish", "turnip",
    "leek", "artichoke", "corn cooked", "squash butternut", "squash acorn",
    "bok choy", "lettuce romaine", "arugula", "collard greens", "swiss chard",
    "garlic raw", "ginger raw", "chili pepper", "jalapeno", "pumpkin",

    # ---- Fruits ----
    "kiwi", "blueberries", "raspberries", "peach", "pear", "plum", "cherries",
    "fig raw", "apricot", "nectarine", "lemon", "lime", "cantaloupe", "honeydew melon",
    "blackberries", "cranberries raw", "passion fruit", "lychee", "persimmon",
    "coconut raw", "raisins",

    # ---- Dairy / Alternatives ----
    "cottage cheese", "mozzarella cheese", "parmesan cheese", "feta cheese",
    "cream cheese", "sour cream", "whipped cream", "almond milk", "soy milk",
    "oat milk", "condensed milk", "evaporated milk",

    # ---- Fats / Oils ----
    "olive oil", "coconut oil", "canola oil", "sesame oil", "avocado raw",

    # ---- Nuts / Seeds ----
    "sunflower seeds", "pumpkin seeds", "chia seeds", "flax seeds", "sesame seeds",
    "pistachios", "hazelnuts", "brazil nuts", "macadamia nuts", "pecans",

    # ---- Condiments / Misc ----
    "hummus", "soy sauce", "ketchup", "mustard", "mayonnaise", "vinegar",
    "honey", "maple syrup", "tahini", "salsa", "pesto",

    # ---- Baked / Breakfast ----
    "waffle", "muffin blueberry", "granola", "cereal cornflakes", "croissant",
    "bagel with cream cheese", "french toast",
]


def fetch_nutrient(food_nutrients, nutrient_name, expected_unit):
    """
    Extracts a specific nutrient's amount from USDA's foodNutrients list.
    Matches on both name AND unit, since USDA sometimes lists the same
    nutrient twice in different units (e.g. Energy in kcal and kJ), and
    some foods use variant names like "Energy (Atwater General Factors)"
    instead of plain "Energy".
    """
    for n in food_nutrients:
        name = n.get("nutrientName", "").lower()
        unit = n.get("unitName", "").lower()

        if name.startswith(nutrient_name.lower()) and unit == expected_unit.lower():
            return n.get("value", 0)
    return 0


def fetch_food_from_usda(search_term):
    """
    Searches USDA for a food term and returns the first Foundation/SR Legacy
    result with nutrition per 100g, or None if nothing suitable is found.
    """
    response = requests.get(
        f"{USDA_BASE_URL}/foods/search",
        params={
            "api_key": settings.usda_api_key,
            "query": search_term,
            "pageSize": 1,
            "dataType": "Foundation,SR Legacy",
        },
        timeout=10,
    )
    response.raise_for_status()
    results = response.json().get("foods", [])

    if not results:
        return None

    food = results[0]
    nutrients = food.get("foodNutrients", [])

    return {
        "name": search_term.title(),
        "usda_description": food.get("description", ""),
        "serving_size": 100,
        "serving_unit": "g",
        "calories": fetch_nutrient(nutrients, "Energy", "kcal"),
        "protein": fetch_nutrient(nutrients, "Protein", "g"),
        "carbs": fetch_nutrient(nutrients, "Carbohydrate, by difference", "g"),
        "fat": fetch_nutrient(nutrients, "Total lipid (fat)", "g"),
        "fiber": fetch_nutrient(nutrients, "Fiber, total dietary", "g"),
        "sugar": fetch_nutrient(nutrients, "Sugars, total including NLEA", "g"),
    }


def fetch_and_seed_usda_foods():
    db = SessionLocal()
    try:
        existing_names = {name for (name,) in db.query(Food.name).all()}

        added_count = 0
        skipped_count = 0
        failed_count = 0

        for term in SEARCH_TERMS:
            display_name = term.title()

            if display_name in existing_names:
                print(f"Skip (already exists): {display_name}")
                skipped_count += 1
                continue

            try:
                food_data = fetch_food_from_usda(term)
            except requests.exceptions.RequestException as e:
                print(f"USDA request failed for '{term}': {e}")
                failed_count += 1
                continue

            if not food_data:
                print(f"Not found on USDA: {term}")
                failed_count += 1
                continue

            usda_match_description = food_data.pop("usda_description")

            if food_data["calories"] == 0:
                print(f"Skipped (no calorie data in USDA record): {food_data['name']} <- '{usda_match_description}'")
                failed_count += 1
                continue

            food = Food(**food_data)

            food = Food(**food_data)
            db.add(food)
            added_count += 1
            print(f"Added: {food_data['name']} <- USDA match: '{usda_match_description}' ({food_data['calories']} kcal/100g)")

        db.commit()
        print(f"\nDone. {added_count} added, {skipped_count} skipped, {failed_count} failed.")
    finally:
        db.close()


if __name__ == "__main__":
    fetch_and_seed_usda_foods()