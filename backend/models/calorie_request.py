from pydantic import BaseModel, Field

class CalorieRequest(BaseModel):
    dish_name: str = Field(..., description="Name of the dish")
    servings: int = Field(..., gt=0, description="Number of servings (>0)")