from fastapi import FastAPI, HTTPException, Depends, Body
from models.calorie_request import CalorieRequest
from services.USDA_service import USDA_service
from utils.constants import MATCH_THRESHOLD
from utils.fuzzy_search import fuzz_search
from sqlalchemy.orm import Session
from models.user import UserCreate, UserLogin
from services.user_service import UserService
from services.security_service import SecurityService
from database import get_db, Base, engine
from middleware.auth_middleware import verify_jwt_token
from fastapi.middleware.cors import CORSMiddleware
 
app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # needed for cookies / auth headers
    allow_methods=["*"],     # allow all HTTP methods
    allow_headers=["*"],     # allow all headers (like Content-Type)
)
app.middleware("http")(verify_jwt_token)
security_service = SecurityService()
Base.metadata.create_all(bind=engine)

@app.post("/getcalories")
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


@app.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db, security_service)
    result = user_service.register_user(user_data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user_service = UserService(db, security_service)
    return user_service.login_user(user_data.email, user_data.password)

@app.post("/refresh")
def refresh_token(refresh_data: dict = Body(...), db: Session = Depends(get_db)):
    refresh_token = refresh_data.get("refreshToken")
    print("token", refresh_token)
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token required")
    user_service = UserService(db, security_service)
    return user_service.refresh_token(refresh_token)