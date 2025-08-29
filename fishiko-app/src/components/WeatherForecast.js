import { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherForecast({ latitude, longitude }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!latitude || !longitude) {
        setError('Please provide valid coordinates.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const apiKey = 'e9c10c01ac2dea943b27202f736c31c6'; 
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setWeather(response.data);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [latitude, longitude]);

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!weather) return null;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Weather Forecast</h3>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700 dark:text-gray-300">
        <p><strong>Location:</strong> {weather.name}</p>
        <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
        <p><strong>Weather:</strong> {weather.weather[0].description}</p>
        <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
        <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
        <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
      </div>
    </div>
  );
}

export default WeatherForecast;