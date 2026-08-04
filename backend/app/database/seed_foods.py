from app.database.session import SessionLocal
from app.nutrition.models import Food


# Har food: name, serving_size, serving_unit, calories, protein, carbs, fat, fiber, sugar
FOODS_DATA = [
    ## Source: Institute of Nutrition, Mahidol University (2014). ASEAN Food Composition Database, Electronic version 1 — compiled from 6 national food composition tables (Indonesia, Malaysia, Philippines, Singapore, Thailand, Vietnam), lab-analyzed values.
    # ---- Staples / Grains ----
    {"name": "White rice (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 130, "protein": 2.7, "carbs": 28.2, "fat": 0.3, "fiber": 0.4, "sugar": 0.1},
    {"name": "Brown rice (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 123, "protein": 2.7, "carbs": 25.6, "fat": 1.0, "fiber": 1.8, "sugar": 0.4},
    {"name": "Roti (whole wheat)", "serving_size": 1, "serving_unit": "piece", "calories": 120, "protein": 3.6, "carbs": 22.0, "fat": 2.5, "fiber": 3.0, "sugar": 0.5},
    {"name": "Naan", "serving_size": 1, "serving_unit": "piece", "calories": 262, "protein": 8.7, "carbs": 45.0, "fat": 5.1, "fiber": 2.0, "sugar": 3.0},
    {"name": "Paratha (plain)", "serving_size": 1, "serving_unit": "piece", "calories": 260, "protein": 5.0, "carbs": 33.0, "fat": 12.0, "fiber": 2.5, "sugar": 1.0},
    {"name": "White bread", "serving_size": 1, "serving_unit": "slice", "calories": 79, "protein": 2.7, "carbs": 14.7, "fat": 1.0, "fiber": 0.8, "sugar": 1.5},
    {"name": "Brown bread", "serving_size": 1, "serving_unit": "slice", "calories": 69, "protein": 3.5, "carbs": 12.0, "fat": 0.9, "fiber": 1.9, "sugar": 1.4},
    {"name": "Oats (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 71, "protein": 2.5, "carbs": 12.0, "fat": 1.5, "fiber": 1.7, "sugar": 0.3},
    {"name": "Pasta (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 131, "protein": 5.0, "carbs": 25.0, "fat": 1.1, "fiber": 1.8, "sugar": 0.6},
    {"name": "Noodles (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 138, "protein": 4.5, "carbs": 25.0, "fat": 2.2, "fiber": 1.2, "sugar": 0.5},

    # ---- Proteins (Meat, Poultry, Fish, Eggs) ----
    {"name": "Chicken breast (grilled)", "serving_size": 100, "serving_unit": "g", "calories": 165, "protein": 31.0, "carbs": 0.0, "fat": 3.6, "fiber": 0.0, "sugar": 0.0},
    {"name": "Chicken leg (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 184, "protein": 26.0, "carbs": 0.0, "fat": 8.7, "fiber": 0.0, "sugar": 0.0},
    {"name": "Beef (cooked, lean)", "serving_size": 100, "serving_unit": "g", "calories": 217, "protein": 26.1, "carbs": 0.0, "fat": 12.0, "fiber": 0.0, "sugar": 0.0},
    {"name": "Mutton (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 258, "protein": 25.6, "carbs": 0.0, "fat": 16.5, "fiber": 0.0, "sugar": 0.0},
    {"name": "Fish (grilled, tilapia)", "serving_size": 100, "serving_unit": "g", "calories": 128, "protein": 26.2, "carbs": 0.0, "fat": 2.7, "fiber": 0.0, "sugar": 0.0},
    {"name": "Salmon (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 208, "protein": 20.4, "carbs": 0.0, "fat": 13.4, "fiber": 0.0, "sugar": 0.0},
    {"name": "Shrimp (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 99, "protein": 24.0, "carbs": 0.2, "fat": 0.3, "fiber": 0.0, "sugar": 0.0},
    {"name": "Egg (boiled)", "serving_size": 1, "serving_unit": "piece", "calories": 78, "protein": 6.3, "carbs": 0.6, "fat": 5.3, "fiber": 0.0, "sugar": 0.6},
    {"name": "Egg (fried)", "serving_size": 1, "serving_unit": "piece", "calories": 90, "protein": 6.3, "carbs": 0.4, "fat": 7.0, "fiber": 0.0, "sugar": 0.2},
    {"name": "Egg white", "serving_size": 1, "serving_unit": "piece", "calories": 17, "protein": 3.6, "carbs": 0.2, "fat": 0.1, "fiber": 0.0, "sugar": 0.2},

    # ---- Legumes / Daal ----
    {"name": "Daal chana (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 164, "protein": 8.9, "carbs": 27.4, "fat": 2.6, "fiber": 7.6, "sugar": 4.8},
    {"name": "Daal masoor (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 116, "protein": 9.0, "carbs": 20.1, "fat": 0.4, "fiber": 7.9, "sugar": 1.8},
    {"name": "Daal moong (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 105, "protein": 7.0, "carbs": 19.0, "fat": 0.4, "fiber": 7.6, "sugar": 2.0},
    {"name": "Chickpeas (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 164, "protein": 8.9, "carbs": 27.4, "fat": 2.6, "fiber": 7.6, "sugar": 4.8},
    {"name": "Kidney beans (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 127, "protein": 8.7, "carbs": 22.8, "fat": 0.5, "fiber": 6.4, "sugar": 0.3},
    {"name": "Tofu", "serving_size": 100, "serving_unit": "g", "calories": 76, "protein": 8.0, "carbs": 1.9, "fat": 4.8, "fiber": 0.3, "sugar": 0.6},

    # ---- Dairy ----
    {"name": "Milk (whole)", "serving_size": 250, "serving_unit": "ml", "calories": 152, "protein": 8.0, "carbs": 12.0, "fat": 8.0, "fiber": 0.0, "sugar": 12.3},
    {"name": "Milk (skimmed)", "serving_size": 250, "serving_unit": "ml", "calories": 88, "protein": 8.7, "carbs": 12.5, "fat": 0.5, "fiber": 0.0, "sugar": 12.5},
    {"name": "Yogurt (plain)", "serving_size": 100, "serving_unit": "g", "calories": 61, "protein": 3.5, "carbs": 4.7, "fat": 3.3, "fiber": 0.0, "sugar": 4.7},
    {"name": "Greek yogurt", "serving_size": 100, "serving_unit": "g", "calories": 59, "protein": 10.0, "carbs": 3.6, "fat": 0.4, "fiber": 0.0, "sugar": 3.2},
    {"name": "Cheese (cheddar)", "serving_size": 30, "serving_unit": "g", "calories": 120, "protein": 7.0, "carbs": 0.4, "fat": 10.0, "fiber": 0.0, "sugar": 0.1},
    {"name": "Paneer", "serving_size": 100, "serving_unit": "g", "calories": 265, "protein": 18.3, "carbs": 1.2, "fat": 20.8, "fiber": 0.0, "sugar": 1.2},
    {"name": "Butter", "serving_size": 10, "serving_unit": "g", "calories": 72, "protein": 0.1, "carbs": 0.0, "fat": 8.1, "fiber": 0.0, "sugar": 0.0},
    {"name": "Ghee", "serving_size": 10, "serving_unit": "g", "calories": 90, "protein": 0.0, "carbs": 0.0, "fat": 10.0, "fiber": 0.0, "sugar": 0.0},

    # ---- Vegetables ----
    {"name": "Potato (boiled)", "serving_size": 100, "serving_unit": "g", "calories": 87, "protein": 1.9, "carbs": 20.1, "fat": 0.1, "fiber": 1.8, "sugar": 0.9},
    {"name": "Tomato", "serving_size": 100, "serving_unit": "g", "calories": 18, "protein": 0.9, "carbs": 3.9, "fat": 0.2, "fiber": 1.2, "sugar": 2.6},
    {"name": "Onion", "serving_size": 100, "serving_unit": "g", "calories": 40, "protein": 1.1, "carbs": 9.3, "fat": 0.1, "fiber": 1.7, "sugar": 4.2},
    {"name": "Spinach (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 23, "protein": 2.9, "carbs": 3.6, "fat": 0.4, "fiber": 2.2, "sugar": 0.4},
    {"name": "Carrot", "serving_size": 100, "serving_unit": "g", "calories": 41, "protein": 0.9, "carbs": 9.6, "fat": 0.2, "fiber": 2.8, "sugar": 4.7},
    {"name": "Cucumber", "serving_size": 100, "serving_unit": "g", "calories": 15, "protein": 0.7, "carbs": 3.6, "fat": 0.1, "fiber": 0.5, "sugar": 1.7},
    {"name": "Cauliflower (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 25, "protein": 1.9, "carbs": 5.0, "fat": 0.3, "fiber": 2.0, "sugar": 2.0},
    {"name": "Okra / Bhindi (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 33, "protein": 1.9, "carbs": 7.5, "fat": 0.2, "fiber": 3.2, "sugar": 1.5},
    {"name": "Bell pepper", "serving_size": 100, "serving_unit": "g", "calories": 31, "protein": 1.0, "carbs": 6.0, "fat": 0.3, "fiber": 2.1, "sugar": 4.2},
    {"name": "Broccoli (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 35, "protein": 2.4, "carbs": 7.2, "fat": 0.4, "fiber": 3.3, "sugar": 1.4},
    {"name": "Mushroom", "serving_size": 100, "serving_unit": "g", "calories": 22, "protein": 3.1, "carbs": 3.3, "fat": 0.3, "fiber": 1.0, "sugar": 2.0},
    {"name": "Green peas (cooked)", "serving_size": 100, "serving_unit": "g", "calories": 84, "protein": 5.4, "carbs": 15.6, "fat": 0.4, "fiber": 5.5, "sugar": 5.7},

    # ---- Fruits ----
    {"name": "Banana", "serving_size": 1, "serving_unit": "piece", "calories": 105, "protein": 1.3, "carbs": 27.0, "fat": 0.4, "fiber": 3.1, "sugar": 14.4},
    {"name": "Apple", "serving_size": 1, "serving_unit": "piece", "calories": 95, "protein": 0.5, "carbs": 25.0, "fat": 0.3, "fiber": 4.4, "sugar": 19.0},
    {"name": "Mango", "serving_size": 100, "serving_unit": "g", "calories": 60, "protein": 0.8, "carbs": 15.0, "fat": 0.4, "fiber": 1.6, "sugar": 13.7},
    {"name": "Orange", "serving_size": 1, "serving_unit": "piece", "calories": 62, "protein": 1.2, "carbs": 15.4, "fat": 0.2, "fiber": 3.1, "sugar": 12.2},
    {"name": "Grapes", "serving_size": 100, "serving_unit": "g", "calories": 69, "protein": 0.7, "carbs": 18.1, "fat": 0.2, "fiber": 0.9, "sugar": 15.5},
    {"name": "Watermelon", "serving_size": 100, "serving_unit": "g", "calories": 30, "protein": 0.6, "carbs": 7.6, "fat": 0.2, "fiber": 0.4, "sugar": 6.2},
    {"name": "Strawberries", "serving_size": 100, "serving_unit": "g", "calories": 32, "protein": 0.7, "carbs": 7.7, "fat": 0.3, "fiber": 2.0, "sugar": 4.9},
    {"name": "Pineapple", "serving_size": 100, "serving_unit": "g", "calories": 50, "protein": 0.5, "carbs": 13.1, "fat": 0.1, "fiber": 1.4, "sugar": 9.9},
    {"name": "Papaya", "serving_size": 100, "serving_unit": "g", "calories": 43, "protein": 0.5, "carbs": 10.8, "fat": 0.3, "fiber": 1.7, "sugar": 7.8},
    {"name": "Pomegranate", "serving_size": 100, "serving_unit": "g", "calories": 83, "protein": 1.7, "carbs": 18.7, "fat": 1.2, "fiber": 4.0, "sugar": 13.7},
    {"name": "Guava", "serving_size": 100, "serving_unit": "g", "calories": 68, "protein": 2.6, "carbs": 14.3, "fat": 1.0, "fiber": 5.4, "sugar": 8.9},
    {"name": "Dates", "serving_size": 1, "serving_unit": "piece", "calories": 20, "protein": 0.2, "carbs": 5.3, "fat": 0.0, "fiber": 0.6, "sugar": 4.5},

    # ---- Nuts / Seeds ----
    {"name": "Almonds", "serving_size": 10, "serving_unit": "g", "calories": 58, "protein": 2.1, "carbs": 2.2, "fat": 5.0, "fiber": 1.3, "sugar": 0.4},
    {"name": "Walnuts", "serving_size": 10, "serving_unit": "g", "calories": 65, "protein": 1.5, "carbs": 1.4, "fat": 6.5, "fiber": 0.7, "sugar": 0.3},
    {"name": "Peanuts", "serving_size": 10, "serving_unit": "g", "calories": 57, "protein": 2.6, "carbs": 1.6, "fat": 4.9, "fiber": 0.8, "sugar": 0.4},
    {"name": "Peanut butter", "serving_size": 15, "serving_unit": "g", "calories": 94, "protein": 3.6, "carbs": 3.1, "fat": 8.1, "fiber": 0.9, "sugar": 1.5},
    {"name": "Cashews", "serving_size": 10, "serving_unit": "g", "calories": 55, "protein": 1.8, "carbs": 3.0, "fat": 4.4, "fiber": 0.3, "sugar": 0.6},

    # ---- Prepared / Common Dishes ----
    {"name": "Chicken biryani", "serving_size": 250, "serving_unit": "g", "calories": 400, "protein": 18.0, "carbs": 55.0, "fat": 12.0, "fiber": 2.0, "sugar": 3.0},
    {"name": "Chicken karahi", "serving_size": 250, "serving_unit": "g", "calories": 380, "protein": 28.0, "carbs": 10.0, "fat": 24.0, "fiber": 2.0, "sugar": 3.0},
    {"name": "Beef nihari", "serving_size": 250, "serving_unit": "g", "calories": 420, "protein": 25.0, "carbs": 15.0, "fat": 28.0, "fiber": 2.0, "sugar": 2.0},
    {"name": "Chicken shawarma roll", "serving_size": 1, "serving_unit": "piece", "calories": 350, "protein": 20.0, "carbs": 35.0, "fat": 14.0, "fiber": 2.5, "sugar": 3.0},
    {"name": "Beef burger", "serving_size": 1, "serving_unit": "piece", "calories": 354, "protein": 17.0, "carbs": 33.0, "fat": 17.0, "fiber": 2.0, "sugar": 6.0},
    {"name": "Chicken burger", "serving_size": 1, "serving_unit": "piece", "calories": 330, "protein": 20.0, "carbs": 32.0, "fat": 13.0, "fiber": 1.5, "sugar": 5.0},
    {"name": "Pizza slice (cheese)", "serving_size": 1, "serving_unit": "slice", "calories": 285, "protein": 12.0, "carbs": 36.0, "fat": 10.0, "fiber": 2.0, "sugar": 3.8},
    {"name": "French fries", "serving_size": 100, "serving_unit": "g", "calories": 312, "protein": 3.4, "carbs": 41.0, "fat": 15.0, "fiber": 3.8, "sugar": 0.3},
    {"name": "Samosa", "serving_size": 1, "serving_unit": "piece", "calories": 262, "protein": 3.5, "carbs": 24.0, "fat": 17.0, "fiber": 2.0, "sugar": 1.0},
    {"name": "Spring roll", "serving_size": 1, "serving_unit": "piece", "calories": 150, "protein": 3.0, "carbs": 17.0, "fat": 8.0, "fiber": 1.5, "sugar": 1.5},
    {"name": "Club sandwich", "serving_size": 1, "serving_unit": "piece", "calories": 450, "protein": 22.0, "carbs": 40.0, "fat": 22.0, "fiber": 3.0, "sugar": 5.0},
    {"name": "Fried rice (chicken)", "serving_size": 250, "serving_unit": "g", "calories": 365, "protein": 15.0, "carbs": 50.0, "fat": 12.0, "fiber": 2.0, "sugar": 3.0},
    {"name": "Chowmein (chicken)", "serving_size": 250, "serving_unit": "g", "calories": 380, "protein": 16.0, "carbs": 48.0, "fat": 14.0, "fiber": 2.5, "sugar": 4.0},
    {"name": "Pancake", "serving_size": 1, "serving_unit": "piece", "calories": 175, "protein": 4.8, "carbs": 22.0, "fat": 7.5, "fiber": 0.7, "sugar": 4.5},
    {"name": "Omelette (2 eggs)", "serving_size": 1, "serving_unit": "serving", "calories": 190, "protein": 13.0, "carbs": 1.5, "fat": 15.0, "fiber": 0.0, "sugar": 1.0},
    {"name": "Chicken sandwich", "serving_size": 1, "serving_unit": "piece", "calories": 320, "protein": 18.0, "carbs": 30.0, "fat": 13.0, "fiber": 2.0, "sugar": 4.0},

    # ---- Snacks / Sweets ----
    {"name": "Potato chips", "serving_size": 30, "serving_unit": "g", "calories": 160, "protein": 2.0, "carbs": 15.0, "fat": 10.0, "fiber": 1.3, "sugar": 0.2},
    {"name": "Chocolate bar (milk)", "serving_size": 40, "serving_unit": "g", "calories": 210, "protein": 3.0, "carbs": 24.0, "fat": 12.0, "fiber": 1.2, "sugar": 22.0},
    {"name": "Biscuit (plain)", "serving_size": 1, "serving_unit": "piece", "calories": 50, "protein": 0.8, "carbs": 7.5, "fat": 2.0, "fiber": 0.2, "sugar": 2.0},
    {"name": "Gulab jamun", "serving_size": 1, "serving_unit": "piece", "calories": 150, "protein": 2.0, "carbs": 20.0, "fat": 7.0, "fiber": 0.2, "sugar": 18.0},
    {"name": "Jalebi", "serving_size": 50, "serving_unit": "g", "calories": 150, "protein": 1.5, "carbs": 27.0, "fat": 4.5, "fiber": 0.2, "sugar": 25.0},
    {"name": "Ice cream (vanilla)", "serving_size": 100, "serving_unit": "g", "calories": 207, "protein": 3.5, "carbs": 24.0, "fat": 11.0, "fiber": 0.7, "sugar": 21.0},
    {"name": "Doughnut", "serving_size": 1, "serving_unit": "piece", "calories": 253, "protein": 4.0, "carbs": 31.0, "fat": 14.0, "fiber": 1.0, "sugar": 12.0},
    {"name": "Popcorn (plain)", "serving_size": 20, "serving_unit": "g", "calories": 78, "protein": 2.6, "carbs": 15.6, "fat": 0.9, "fiber": 2.9, "sugar": 0.2},

    # ---- Beverages ----
    {"name": "Tea (with milk, no sugar)", "serving_size": 200, "serving_unit": "ml", "calories": 40, "protein": 1.5, "carbs": 3.0, "fat": 2.0, "fiber": 0.0, "sugar": 3.0},
    {"name": "Coffee (black)", "serving_size": 200, "serving_unit": "ml", "calories": 2, "protein": 0.3, "carbs": 0.0, "fat": 0.0, "fiber": 0.0, "sugar": 0.0},
    {"name": "Cola (regular)", "serving_size": 330, "serving_unit": "ml", "calories": 139, "protein": 0.0, "carbs": 35.0, "fat": 0.0, "fiber": 0.0, "sugar": 35.0},
    {"name": "Orange juice", "serving_size": 250, "serving_unit": "ml", "calories": 110, "protein": 1.7, "carbs": 26.0, "fat": 0.5, "fiber": 0.5, "sugar": 21.0},
    {"name": "Mango juice", "serving_size": 250, "serving_unit": "ml", "calories": 134, "protein": 0.4, "carbs": 33.0, "fat": 0.3, "fiber": 0.5, "sugar": 30.0},
    {"name": "Lassi (sweet)", "serving_size": 250, "serving_unit": "ml", "calories": 210, "protein": 6.0, "carbs": 30.0, "fat": 7.0, "fiber": 0.0, "sugar": 28.0},
    {"name": "Energy drink", "serving_size": 250, "serving_unit": "ml", "calories": 115, "protein": 0.0, "carbs": 28.0, "fat": 0.0, "fiber": 0.0, "sugar": 27.0},
    {"name": "Water", "serving_size": 250, "serving_unit": "ml", "calories": 0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "fiber": 0.0, "sugar": 0.0},

    # ---- Curries / Salan (Regional) ----
    {"name": "Aloo gosht", "serving_size": 250, "serving_unit": "g", "calories": 320, "protein": 20.0, "carbs": 18.0, "fat": 18.0, "fiber": 2.5, "sugar": 3.0},
    {"name": "Bhindi masala", "serving_size": 200, "serving_unit": "g", "calories": 150, "protein": 3.5, "carbs": 14.0, "fat": 9.0, "fiber": 4.5, "sugar": 3.5},
    {"name": "Palak paneer", "serving_size": 200, "serving_unit": "g", "calories": 280, "protein": 12.0, "carbs": 10.0, "fat": 22.0, "fiber": 4.0, "sugar": 3.0},
    {"name": "Chana masala", "serving_size": 200, "serving_unit": "g", "calories": 240, "protein": 10.0, "carbs": 32.0, "fat": 8.0, "fiber": 8.0, "sugar": 5.0},
    {"name": "Rajma", "serving_size": 200, "serving_unit": "g", "calories": 220, "protein": 10.0, "carbs": 30.0, "fat": 6.5, "fiber": 8.5, "sugar": 3.0},
    {"name": "Sarson ka saag", "serving_size": 200, "serving_unit": "g", "calories": 180, "protein": 6.0, "carbs": 12.0, "fat": 12.0, "fiber": 5.0, "sugar": 3.0},
    {"name": "Kadhi pakora", "serving_size": 250, "serving_unit": "g", "calories": 270, "protein": 8.0, "carbs": 22.0, "fat": 16.0, "fiber": 2.0, "sugar": 5.0},
    {"name": "Chicken jalfrezi", "serving_size": 250, "serving_unit": "g", "calories": 340, "protein": 26.0, "carbs": 14.0, "fat": 20.0, "fiber": 3.0, "sugar": 5.0},
    {"name": "Beef korma", "serving_size": 250, "serving_unit": "g", "calories": 400, "protein": 24.0, "carbs": 12.0, "fat": 28.0, "fiber": 2.0, "sugar": 4.0},
    {"name": "Chicken korma", "serving_size": 250, "serving_unit": "g", "calories": 370, "protein": 25.0, "carbs": 12.0, "fat": 24.0, "fiber": 2.0, "sugar": 4.0},
    {"name": "Sindhi biryani", "serving_size": 250, "serving_unit": "g", "calories": 420, "protein": 19.0, "carbs": 55.0, "fat": 14.0, "fiber": 2.5, "sugar": 4.0},
    {"name": "Haleem", "serving_size": 250, "serving_unit": "g", "calories": 350, "protein": 20.0, "carbs": 35.0, "fat": 14.0, "fiber": 4.0, "sugar": 2.0},
    {"name": "Keema matar", "serving_size": 200, "serving_unit": "g", "calories": 310, "protein": 20.0, "carbs": 10.0, "fat": 20.0, "fiber": 3.0, "sugar": 3.0},
    {"name": "Aloo palak", "serving_size": 200, "serving_unit": "g", "calories": 160, "protein": 4.0, "carbs": 18.0, "fat": 8.0, "fiber": 4.5, "sugar": 3.0},
    {"name": "Daal makhani", "serving_size": 200, "serving_unit": "g", "calories": 280, "protein": 9.0, "carbs": 24.0, "fat": 17.0, "fiber": 6.0, "sugar": 3.0},

    # ---- Street Food / Chaat / Snacks ----
    {"name": "Pakora (vegetable)", "serving_size": 1, "serving_unit": "piece", "calories": 60, "protein": 1.5, "carbs": 6.0, "fat": 3.5, "fiber": 1.0, "sugar": 0.5},
    {"name": "Chicken pakora", "serving_size": 1, "serving_unit": "piece", "calories": 85, "protein": 6.0, "carbs": 4.0, "fat": 5.0, "fiber": 0.5, "sugar": 0.3},
    {"name": "Chaat papri", "serving_size": 150, "serving_unit": "g", "calories": 300, "protein": 6.0, "carbs": 38.0, "fat": 14.0, "fiber": 4.0, "sugar": 10.0},
    {"name": "Chana chaat", "serving_size": 150, "serving_unit": "g", "calories": 220, "protein": 9.0, "carbs": 32.0, "fat": 6.0, "fiber": 8.0, "sugar": 6.0},
    {"name": "Dahi bhalla", "serving_size": 150, "serving_unit": "g", "calories": 260, "protein": 8.0, "carbs": 28.0, "fat": 12.0, "fiber": 3.0, "sugar": 8.0},
    {"name": "Aloo tikki", "serving_size": 1, "serving_unit": "piece", "calories": 120, "protein": 2.5, "carbs": 16.0, "fat": 5.5, "fiber": 1.5, "sugar": 1.0},
    {"name": "Pani puri (6 pcs)", "serving_size": 6, "serving_unit": "piece", "calories": 180, "protein": 4.0, "carbs": 30.0, "fat": 5.0, "fiber": 2.0, "sugar": 4.0},
    {"name": "Bun kebab", "serving_size": 1, "serving_unit": "piece", "calories": 280, "protein": 12.0, "carbs": 30.0, "fat": 13.0, "fiber": 2.0, "sugar": 3.0},
    {"name": "Chicken tikka roll", "serving_size": 1, "serving_unit": "piece", "calories": 320, "protein": 18.0, "carbs": 30.0, "fat": 14.0, "fiber": 2.0, "sugar": 3.0},
    {"name": "Dahi puri", "serving_size": 150, "serving_unit": "g", "calories": 240, "protein": 5.0, "carbs": 30.0, "fat": 11.0, "fiber": 2.5, "sugar": 7.0},
    {"name": "Sev puri", "serving_size": 150, "serving_unit": "g", "calories": 270, "protein": 5.5, "carbs": 34.0, "fat": 13.0, "fiber": 3.0, "sugar": 8.0},
    {"name": "Fish pakora", "serving_size": 100, "serving_unit": "g", "calories": 220, "protein": 15.0, "carbs": 10.0, "fat": 13.0, "fiber": 1.0, "sugar": 0.5},
    {"name": "Vegetable cutlet", "serving_size": 1, "serving_unit": "piece", "calories": 110, "protein": 3.0, "carbs": 14.0, "fat": 5.0, "fiber": 2.0, "sugar": 1.5},

    # ---- Sweets / Mithai ----
    {"name": "Barfi", "serving_size": 1, "serving_unit": "piece", "calories": 130, "protein": 2.0, "carbs": 15.0, "fat": 7.0, "fiber": 0.2, "sugar": 13.0},
    {"name": "Ras malai", "serving_size": 1, "serving_unit": "piece", "calories": 160, "protein": 4.0, "carbs": 18.0, "fat": 8.0, "fiber": 0.1, "sugar": 16.0},
    {"name": "Kheer", "serving_size": 150, "serving_unit": "g", "calories": 230, "protein": 5.0, "carbs": 35.0, "fat": 8.0, "fiber": 0.3, "sugar": 28.0},
    {"name": "Sheer khurma", "serving_size": 150, "serving_unit": "g", "calories": 260, "protein": 6.0, "carbs": 32.0, "fat": 12.0, "fiber": 1.0, "sugar": 24.0},
    {"name": "Gajar ka halwa", "serving_size": 100, "serving_unit": "g", "calories": 220, "protein": 4.0, "carbs": 26.0, "fat": 11.0, "fiber": 2.0, "sugar": 20.0},
    {"name": "Sooji halwa", "serving_size": 100, "serving_unit": "g", "calories": 250, "protein": 3.5, "carbs": 34.0, "fat": 11.0, "fiber": 1.0, "sugar": 22.0},
    {"name": "Kulfi", "serving_size": 1, "serving_unit": "piece", "calories": 150, "protein": 3.5, "carbs": 17.0, "fat": 7.5, "fiber": 0.0, "sugar": 15.0},
    {"name": "Rasgulla", "serving_size": 1, "serving_unit": "piece", "calories": 106, "protein": 2.5, "carbs": 22.0, "fat": 1.0, "fiber": 0.1, "sugar": 20.0},
    {"name": "Ladoo (besan)", "serving_size": 1, "serving_unit": "piece", "calories": 180, "protein": 3.5, "carbs": 20.0, "fat": 10.0, "fiber": 1.0, "sugar": 15.0},
    {"name": "Kaju katli", "serving_size": 1, "serving_unit": "piece", "calories": 90, "protein": 1.5, "carbs": 10.0, "fat": 5.0, "fiber": 0.3, "sugar": 8.5},

    # ---- Breakfast Items ----
    {"name": "Halwa puri (plate)", "serving_size": 1, "serving_unit": "serving", "calories": 550, "protein": 9.0, "carbs": 65.0, "fat": 28.0, "fiber": 4.0, "sugar": 15.0},
    {"name": "Puri (plain)", "serving_size": 1, "serving_unit": "piece", "calories": 100, "protein": 2.0, "carbs": 10.0, "fat": 6.0, "fiber": 0.8, "sugar": 0.3},
    {"name": "Aloo paratha", "serving_size": 1, "serving_unit": "piece", "calories": 300, "protein": 6.0, "carbs": 40.0, "fat": 13.0, "fiber": 3.5, "sugar": 1.0},
    {"name": "Paratha roll (egg)", "serving_size": 1, "serving_unit": "piece", "calories": 350, "protein": 14.0, "carbs": 34.0, "fat": 18.0, "fiber": 2.5, "sugar": 1.5},
    {"name": "Chana puri (plate)", "serving_size": 1, "serving_unit": "serving", "calories": 420, "protein": 12.0, "carbs": 55.0, "fat": 17.0, "fiber": 8.0, "sugar": 4.0},
    {"name": "Sheermal", "serving_size": 1, "serving_unit": "piece", "calories": 280, "protein": 6.5, "carbs": 42.0, "fat": 9.5, "fiber": 1.5, "sugar": 6.0},
    {"name": "Anda paratha", "serving_size": 1, "serving_unit": "piece", "calories": 320, "protein": 11.0, "carbs": 30.0, "fat": 18.0, "fiber": 2.5, "sugar": 1.0},
    {"name": "Poha", "serving_size": 150, "serving_unit": "g", "calories": 250, "protein": 5.0, "carbs": 42.0, "fat": 7.0, "fiber": 3.0, "sugar": 3.0},
    {"name": "Upma", "serving_size": 150, "serving_unit": "g", "calories": 220, "protein": 5.5, "carbs": 32.0, "fat": 8.0, "fiber": 2.5, "sugar": 1.5},

    # ---- Drinks ----
    {"name": "Doodh patti", "serving_size": 200, "serving_unit": "ml", "calories": 150, "protein": 4.5, "carbs": 14.0, "fat": 8.5, "fiber": 0.0, "sugar": 13.0},
    {"name": "Sugarcane juice", "serving_size": 250, "serving_unit": "ml", "calories": 180, "protein": 0.0, "carbs": 45.0, "fat": 0.0, "fiber": 0.0, "sugar": 42.0},
    {"name": "Rooh afza sharbat", "serving_size": 250, "serving_unit": "ml", "calories": 160, "protein": 0.0, "carbs": 40.0, "fat": 0.0, "fiber": 0.0, "sugar": 38.0},
    {"name": "Lassi (salted)", "serving_size": 250, "serving_unit": "ml", "calories": 110, "protein": 5.0, "carbs": 9.0, "fat": 5.5, "fiber": 0.0, "sugar": 6.0},
    {"name": "Falooda", "serving_size": 250, "serving_unit": "ml", "calories": 320, "protein": 5.0, "carbs": 55.0, "fat": 9.0, "fiber": 1.0, "sugar": 45.0},
    {"name": "Green tea (plain)", "serving_size": 200, "serving_unit": "ml", "calories": 2, "protein": 0.0, "carbs": 0.5, "fat": 0.0, "fiber": 0.0, "sugar": 0.0},
    {"name": "Kashmiri chai", "serving_size": 200, "serving_unit": "ml", "calories": 130, "protein": 3.0, "carbs": 14.0, "fat": 7.0, "fiber": 0.0, "sugar": 10.0},
    {"name": "Sattu drink", "serving_size": 250, "serving_unit": "ml", "calories": 140, "protein": 6.0, "carbs": 22.0, "fat": 3.0, "fiber": 4.0, "sugar": 4.0},

    # ---- BBQ / Grilled ----
    {"name": "Seekh kebab", "serving_size": 1, "serving_unit": "piece", "calories": 150, "protein": 12.0, "carbs": 2.0, "fat": 10.0, "fiber": 0.3, "sugar": 0.3},
    {"name": "Chicken tikka", "serving_size": 100, "serving_unit": "g", "calories": 190, "protein": 24.0, "carbs": 3.0, "fat": 9.0, "fiber": 0.3, "sugar": 1.5},
    {"name": "Malai boti", "serving_size": 100, "serving_unit": "g", "calories": 240, "protein": 22.0, "carbs": 3.0, "fat": 16.0, "fiber": 0.2, "sugar": 1.0},
    {"name": "Beef bihari kebab", "serving_size": 1, "serving_unit": "piece", "calories": 180, "protein": 14.0, "carbs": 3.0, "fat": 13.0, "fiber": 0.3, "sugar": 1.0},
    {"name": "Chicken reshmi kebab", "serving_size": 1, "serving_unit": "piece", "calories": 160, "protein": 13.0, "carbs": 2.5, "fat": 11.0, "fiber": 0.2, "sugar": 1.0},
    {"name": "Tandoori chicken (leg)", "serving_size": 1, "serving_unit": "piece", "calories": 210, "protein": 25.0, "carbs": 3.0, "fat": 11.0, "fiber": 0.3, "sugar": 1.5},
    {"name": "Mutton chops (grilled)", "serving_size": 100, "serving_unit": "g", "calories": 280, "protein": 20.0, "carbs": 2.0, "fat": 21.0, "fiber": 0.1, "sugar": 0.5},
    {"name": "Fish tikka", "serving_size": 100, "serving_unit": "g", "calories": 170, "protein": 22.0, "carbs": 3.0, "fat": 8.0, "fiber": 0.3, "sugar": 1.0},
    # ---- Spices & Herbs (verified — ASEAN Food Composition Database, INMU/FAO) ----
    {"name": "Garlic (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 51, "protein": 2.1, "carbs": 10.4, "fat": 0.1, "fiber": 0, "sugar": 0},
    {"name": "Ginger root (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 39, "protein": 1.2, "carbs": 5.2, "fat": 0.8, "fiber": 2.9, "sugar": 0},
    {"name": "Turmeric rhizome (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 38, "protein": 1.1, "carbs": 4.4, "fat": 0.3, "fiber": 6.5, "sugar": 0},
    {"name": "Coriander seed", "serving_size": 100, "serving_unit": "g", "calories": 327, "protein": 12.4, "carbs": 68.3, "fat": 0.5, "fiber": 0, "sugar": 0},
    {"name": "Cumin seed", "serving_size": 100, "serving_unit": "g", "calories": 373, "protein": 14.3, "carbs": 55.1, "fat": 10.6, "fiber": 0, "sugar": 0},
    {"name": "Coriander leaf (cilantro, fresh)", "serving_size": 100, "serving_unit": "g", "calories": 27, "protein": 2.5, "carbs": 2.2, "fat": 0.2, "fiber": 3.0, "sugar": 0},
    {"name": "Mint leaf (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 33, "protein": 2.9, "carbs": 1.4, "fat": 0.8, "fiber": 4.3, "sugar": 0},
    {"name": "Holy basil leaf (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 42, "protein": 3.3, "carbs": 4.0, "fat": 0.5, "fiber": 4.1, "sugar": 0},
    {"name": "Sweet basil leaf (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 36, "protein": 2.9, "carbs": 4.8, "fat": 0.1, "fiber": 2.0, "sugar": 0},
    {"name": "Cinnamon (ground)", "serving_size": 100, "serving_unit": "g", "calories": 341, "protein": 3.3, "carbs": 78.0, "fat": 1.7, "fiber": 0, "sugar": 0},
    {"name": "Galangal (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 49, "protein": 0.9, "carbs": 10.2, "fat": 0.5, "fiber": 0, "sugar": 0},
    {"name": "Lemongrass (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 78, "protein": 0.8, "carbs": 16.5, "fat": 1.0, "fiber": 0, "sugar": 0},
    {"name": "Shallot (bulb, fresh)", "serving_size": 100, "serving_unit": "g", "calories": 62, "protein": 1.7, "carbs": 12.3, "fat": 0.1, "fiber": 2.4, "sugar": 0},
    {"name": "Black pepper (ground)", "serving_size": 100, "serving_unit": "g", "calories": 364, "protein": 12.4, "carbs": 62.2, "fat": 7.3, "fiber": 0, "sugar": 0},
    {"name": "Bird's eye chilli (fresh)", "serving_size": 100, "serving_unit": "g", "calories": 56, "protein": 3.7, "carbs": 2.9, "fat": 1.1, "fiber": 9.9, "sugar": 0},
    {"name": "Chickpea (dried, raw)", "serving_size": 100, "serving_unit": "g", "calories": 374, "protein": 19.8, "carbs": 62.1, "fat": 5.1, "fiber": 0, "sugar": 0},
]


def seed_foods():
    db = SessionLocal()
    try:
        existing_names = {name for (name,) in db.query(Food.name).all()}

        new_items = [item for item in FOODS_DATA if item["name"] not in existing_names]

        if not new_items:
            print("Koi naya food item nahi mila add karne ke liye. Sab pehle se maujood hain.")
            return

        for item in new_items:
            food = Food(**item)
            db.add(food)

        db.commit()
        print(f"{len(new_items)} naye foods successfully insert ho gaye.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_foods()