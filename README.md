# Weather Dashboard

A modern weather dashboard built with Python FastAPI that shows current weather conditions and forecasts.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
4. Create a `.env` file in the root directory and add your API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
5. Run the application:
   ```
   uvicorn main:app --reload
   ```

## Features

- Real-time weather data
- Current weather conditions
- 5-day forecast
- Temperature, humidity, and wind speed information
- Clean and modern UI
