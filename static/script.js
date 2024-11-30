// Theme switcher
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

toggleSwitch.addEventListener('change', switchTheme);

// Weather functionality
async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    const loadingScreen = document.querySelector('.loading');
    
    if (!city) {
        showNotification('Please enter a city name');
        return;
    }

    try {
        loadingScreen.classList.add('active');
        const response = await fetch(`/weather/${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.error) {
            showNotification(data.error);
            return;
        }

        displayWeather(data);
        document.getElementById('weatherInfo').style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred while fetching weather data');
    } finally {
        loadingScreen.classList.remove('active');
    }
}

function displayWeather(data) {
    // Animate the display of weather information
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.style.opacity = '0';
    
    // Display current weather with animation
    const current = data.current;
    document.getElementById('cityName').textContent = current.name;
    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°`;
    document.getElementById('description').textContent = current.weather[0].description;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} m/s`;
    
    // Weather icon with animation
    const iconCode = current.weather[0].icon;
    document.getElementById('weatherIcon').innerHTML = 
        `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon" class="weather-icon">`;

    // Display forecast with animation
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Get one forecast per day
    const dailyForecasts = data.forecast.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        forecastItem.innerHTML = `
            <h5>${day}</h5>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
            <p class="temp">${Math.round(forecast.main.temp)}°C</p>
            <p class="desc">${forecast.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });

    // Fade in the weather info
    setTimeout(() => {
        weatherInfo.style.opacity = '1';
        weatherInfo.style.transition = 'opacity 0.5s ease';
    }, 100);
}

function showNotification(message) {
    // You could replace this with a custom notification component
    alert(message);
}

// Allow Enter key to trigger search
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Add some animations when the page loads
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('h1').style.opacity = '0';
    document.querySelector('.search-container').style.opacity = '0';
    
    setTimeout(() => {
        document.querySelector('h1').style.opacity = '1';
        document.querySelector('h1').style.transition = 'opacity 0.5s ease';
    }, 100);
    
    setTimeout(() => {
        document.querySelector('.search-container').style.opacity = '1';
        document.querySelector('.search-container').style.transition = 'opacity 0.5s ease';
    }, 300);
});
