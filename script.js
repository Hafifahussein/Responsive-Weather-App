document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '070870365c920bd47d550f0447337663';
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // DOM elements for weather data and user inputs
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const cityName = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const weatherDescription = document.getElementById('weather-description');
    const windSpeed = document.getElementById('wind-speed');
    const humidity = document.getElementById('humidity');
    const pressure = document.getElementById('pressure');
    const visibility = document.getElementById('visibility');
    const forecast = document.getElementById('forecast');

    // Event listeners:-( search button, location button, and Enter key)
    searchBtn.addEventListener('click', searchWeather);
    locationBtn.addEventListener('click', getLocationWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });

    fetchWeather('Nairobi');

    function searchWeather() {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            alert('Please enter a city name');
        }
    }
   // function retrieving location coordinates using API
    function getLocationWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeatherByCoords(lat, lon);
                },
                error => {
                    alert('Error getting location: ' + error.message);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    }

    // The function gets current and forecast weather by city name
    function fetchWeather(city) {
        const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
        console.log("Attempting to fetch from:", url); // Debug line

        fetch(url)
            .then(response => {
                console.log("Response status:", response.status); // Debug
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.message || 'City not found');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Received data:", data); // Debug
                displayCurrentWeather(data);
                return fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
            })

            .then(response => response.json())
            .then(data => displayForecast(data))
            .catch(error => {
                alert(error.message);
                console.error('Error:', error);
            });
    }

});