from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from utils.fuzzy_search import fuzz_search
from fuzzywuzzy import fuzz
from dotenv import load_dotenv
import requests
import os

load_dotenv()
app = FastAPI()

USDA_API_KEY = os.getenv('USDA_API_KEY')
USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"


class CalorieRequest(BaseModel):
    dish_name: str
    servings: int = Field(..., gt=0, description="Number of servings must be > 0")

MATCH_THRESHOLD = 60
PAGE_SIZE = 10

@app.post("/get-calories")
def get_calories(req: CalorieRequest):
    if not USDA_API_KEY:
        raise HTTPException(status_code=500, detail="USDA_API_KEY not set in .env")

    params = {"api_key": USDA_API_KEY, "query": req.dish_name, "pageSize": PAGE_SIZE}

    try:
        response = requests.get(USDA_SEARCH_URL, params=params)
        response.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"USDA API error: {e}")

    data = response.json()
    if not data.get("foods"):
        raise HTTPException(status_code=404, detail="Dish not found in USDA database")

    grade, match_element = fuzz_search(req.dish_name.lower(), data["foods"], "description")
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

    if total_calories is None:
        raise HTTPException(status_code=404, detail="Calories info not available")

    return {
        "dish_name": match_element.get("description", "").lower(),
        "servings": req.servings,
        "calories_per_serving": calories_per_serving,
        "total_calories": total_calories,
        "source": "USDA FoodData Central"
    }
