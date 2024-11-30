from fastapi import FastAPI, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
import requests
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
load_dotenv()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

API_KEY = "fe4e6235c7c3d4e450a9c51b001415c1"  # Using your active API key
BASE_URL = "http://api.openweathermap.org/data/2.5"

logger.info(f"API Key loaded: {API_KEY[:5]}...")  # Log first 5 characters of API key

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/weather/{city}")
async def get_weather(city: str):
    try:
        # Get current weather
        current_weather_url = f"{BASE_URL}/weather?q={city}&appid={API_KEY}&units=metric"
        logger.info(f"Requesting current weather for {city}")
        logger.info(f"URL: {current_weather_url}")
        
        current_response = requests.get(current_weather_url)
        logger.info(f"Current weather response status: {current_response.status_code}")
        
        if current_response.status_code != 200:
            error_data = current_response.json()
            logger.error(f"Current weather error: {error_data}")
            return {"error": f"City not found or API error: {error_data.get('message', 'Unknown error')}"}
        
        # Get 5-day forecast
        forecast_url = f"{BASE_URL}/forecast?q={city}&appid={API_KEY}&units=metric"
        logger.info(f"Requesting forecast for {city}")
        forecast_response = requests.get(forecast_url)
        logger.info(f"Forecast response status: {forecast_response.status_code}")
        
        if forecast_response.status_code != 200:
            error_data = forecast_response.json()
            logger.error(f"Forecast error: {error_data}")
            return {"error": f"City not found or API error: {error_data.get('message', 'Unknown error')}"}
        
        weather_data = {
            "current": current_response.json(),
            "forecast": forecast_response.json()
        }
        return weather_data
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return {"error": f"Server error: {str(e)}"}
