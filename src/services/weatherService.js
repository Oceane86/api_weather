import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '../.env' });

export async function fetchWeatherData(lat, lng) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=fr`;

    try {
        const response = await fetch(weatherUrl);
        const weatherData = await response.json();

        if (!weatherData || !weatherData.main || !weatherData.weather) {
            console.error("Incomplete weather data:", weatherData);
            throw new Error('Weather data is incomplete or unavailable.');
        }

        return {
            cityName: weatherData.name,
            name: weatherData.name,
            temperature: weatherData.main.temp,
            weather: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            humidity: weatherData.main.humidity || 0,
            wind: {
                speed: weatherData.wind.speed || 0, // Vitesse du vent
                deg: weatherData.wind.deg || 0,     // Direction du vent en degrés
                gust: weatherData.wind.gust || 0 
            },

           
        };
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        throw error;
    }
}

export async function fetchCityName(lat, lng) {
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`;

    try {
        const response = await fetch(reverseGeocodeUrl);
        const reverseGeocodeData = await response.json();

        if (!reverseGeocodeData || !reverseGeocodeData.address || !reverseGeocodeData.address.city) {
            console.error("Incomplete reverse geocode data:", reverseGeocodeData);
            throw new Error('City name data is incomplete or unavailable.');
        }

        return reverseGeocodeData.address.city;
        
    } catch (error) {
        console.error('Failed to fetch city name data:', error);
        throw error;
    }
}
