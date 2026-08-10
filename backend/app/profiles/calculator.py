def calculate_nutrition_goals(
    age: int,
    gender: str,
    height_cm: float,
    weight_kg: float,
    activity_level: str,
    fitness_goal: str,
) -> dict:
    """
    Calculates suggested daily calorie and macro goals using the
    Mifflin-St Jeor equation. This is a standard, deterministic formula
    used by most nutrition apps - not an AI estimate.
    """

    # Step 1: Basal Metabolic Rate (BMR)
    if gender.lower() == "male":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161

    # Step 2: Total Daily Energy Expenditure (TDEE)
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
        "extra active": 1.9,
    }
    multiplier = activity_multipliers.get(activity_level.lower(), 1.2)
    tdee = bmr * multiplier

    # Step 3: Adjust for fitness goal
    goal = fitness_goal.lower()
    if goal == "lose weight":
        calorie_goal = tdee - 500
    elif goal in ("gain weight", "build muscle"):
        calorie_goal = tdee + 300
    else:
        calorie_goal = tdee

    calorie_goal = max(calorie_goal, 1200)  # safety floor

    # Step 4: Macro split - 30% protein, 40% carbs, 30% fat
    protein_goal = (calorie_goal * 0.30) / 4
    carbs_goal = (calorie_goal * 0.40) / 4
    fat_goal = (calorie_goal * 0.30) / 9

    # Step 5: Water goal (35ml per kg of body weight)
    water_goal = weight_kg * 35

    return {
        "calorie_goal": round(calorie_goal),
        "protein_goal": round(protein_goal),
        "carbs_goal": round(carbs_goal),
        "fat_goal": round(fat_goal),
        "water_goal": round(water_goal),
    }
