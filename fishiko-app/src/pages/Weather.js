import { useState } from 'react';
import WeatherForecast from '../components/WeatherForecast';

function Weather() {
  const [coordinates, setCoordinates] = useState({ latitude: '', longitude: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoordinates({ ...coordinates, [name]: value });
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Weather Forecast</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={coordinates.latitude}
            onChange={handleChange}
            placeholder="e.g., 44.67"
            step="any"
            className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={coordinates.longitude}
            onChange={handleChange}
            placeholder="e.g., -63.58"
            step="any"
            className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white border-gray-300"
          />
        </div>
        <WeatherForecast latitude={coordinates.latitude} longitude={coordinates.longitude} />
      </div>
    </div>
  );
}

export default Weather;