from fastapi import FastAPI, HTTPException
from models.calorie_request import CalorieRequest
from services.USDA_service import USDA_service
from utils.constants import MATCH_THRESHOLD
from utils.fuzzy_search import fuzz_search

app = FastAPI()

@app.post("/get-calories")
def get_calories(req: CalorieRequest):
    try:
        USDA = USDA_service()
        foods = USDA.search_food(req.dish_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not foods:
        raise HTTPException(status_code=404, detail="Dish not found in USDA database")

    grade, match_element = fuzz_search(req.dish_name.lower(), foods, "description", MATCH_THRESHOLD)
    if grade < MATCH_THRESHOLD or not match_element:
        raise HTTPException(status_code=404, detail="Dish not found in USDA database")

    calories_per_serving = None

    # Foods -> FoodNutrients -> Nutrient -> energy -> value 
    for nutrient in match_element.get("foodNutrients", []): 
        if nutrient["nutrientName"].lower().startswith("energy"): 
            calories_per_serving = nutrient["value"] 
            break

    if calories_per_serving is None: 
        raise HTTPException(status_code=404, detail="Calories info not available") 
    
    total_calories = calories_per_serving * req.servings
    return {
        "dish_name": match_element.get("description", "").lower(),
        "servings": req.servings,
        "calories_per_serving": calories_per_serving,
        "total_calories": total_calories,
        "source": "USDA FoodData Central"
    }
