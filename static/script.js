async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`/weather/${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        displayWeather(data);
        document.getElementById('weatherInfo').style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    // Display current weather
    const current = data.current;
    document.getElementById('cityName').textContent = current.name;
    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('description').textContent = current.weather[0].description;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} m/s`;
    
    // Weather icon
    const iconCode = current.weather[0].icon;
    document.getElementById('weatherIcon').innerHTML = 
        `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;

    // Display forecast
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Get one forecast per day (every 8th item as the API returns 3-hour forecasts)
    const dailyForecasts = data.forecast.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <h5>${day}</h5>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
            <p>${Math.round(forecast.main.temp)}°C</p>
            <p>${forecast.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

// Allow Enter key to trigger search
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});
