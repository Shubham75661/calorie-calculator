from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import requests
import os

load_dotenv()

class USDA_service:
    API_KEY = os.getenv('USDA_API_KEY')
    USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
    page_size = 10

    def __init__(self):
        if not self.API_KEY:
            raise ValueError("API Key is not initialize")
        
    def search_food(self, dish_name):
        print(dish_name)
        params = {
            "api_key" : self.API_KEY,
            "query" : dish_name,
            "pageSize" : self.page_size
        }

        try:
            response = requests.get(self.USDA_SEARCH_URL, params)
            response.raise_for_status()
            return response.json().get("foods", [])
        except requests.RequestException as e:
            raise Exception(f"USDA API request failed: {str(e)}")