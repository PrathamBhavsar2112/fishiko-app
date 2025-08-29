import { useState } from 'react';
import axios from 'axios';
import MapDisplay from './MapDisplay';
import PinDropMap from './PinDropMap';

function PredictionForm({ token }) {
  const [formData, setFormData] = useState({
    temperature_degree_c: '',
    salinity_psu: '32.5',
    season: 'Spring',
    latitude: '',
    longitude: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fishing tips database
  const fishingTips = {
    'Cod': {
      bait: 'Use squid or clams as bait.',
      time: 'Best fished at dawn or dusk.',
      gear: 'Medium-heavy rod with 20-30 lb line.'
    },
    'Haddock': {
      bait: 'Try shrimp or small fish like herring.',
      time: 'Fish during early morning hours.',
      gear: 'Light to medium rod with 15-20 lb line.'
    },
    'Salmon': {
      bait: 'Use spoons or spinners.',
      time: 'Fish in the evening or early morning.',
      gear: 'Medium rod with 10-20 lb line.'
    },
    'Mackerel': {
      bait: 'Use small jigs or feathers.',
      time: 'Fish during mid-day when they\'re most active.',
      gear: 'Light rod with 8-12 lb line.'
    },
    'Halibut': {
      bait: 'Use large bait like herring or mackerel.',
      time: 'Fish during slack tides.',
      gear: 'Heavy rod with 50-80 lb line.'
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    switch (name) {
      case 'temperature_degree_c':
        if (!value) {
          errors[name] = 'Temperature is required';
        } else if (isNaN(value) || parseFloat(value) < -2 || parseFloat(value) > 30) {
          errors[name] = 'Temperature must be between -2 and 30°C';
        } else {
          delete errors[name];
        }
        break;
      case 'salinity_psu':
        if (!value) {
          errors[name] = 'Salinity is required';
        } else if (isNaN(value) || parseFloat(value) < 25 || parseFloat(value) > 35) {
          errors[name] = 'Salinity must be between 25 and 35 PSU';
        } else {
          delete errors[name];
        }
        break;
      case 'latitude':
        if (value && (isNaN(value) || parseFloat(value) < 44.5 || parseFloat(value) > 44.8)) {
          errors[name] = 'Latitude must be between 44.5 and 44.8';
        } else {
          delete errors[name];
        }
        break;
      case 'longitude':
        if (value && (isNaN(value) || parseFloat(value) < -63.7 || parseFloat(value) > -63.4)) {
          errors[name] = 'Longitude must be between -63.7 and -63.4';
        } else {
          delete errors[name];
        }
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  const handleCoordinatesChange = ({ latitude, longitude }) => {
    setFormData({
      ...formData,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
    validateField('latitude', latitude.toString());
    validateField('longitude', longitude.toString());
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const errors = {};
    if (!formData.temperature_degree_c) {
      errors.temperature_degree_c = 'Temperature is required';
    } else if (
      isNaN(formData.temperature_degree_c) ||
      parseFloat(formData.temperature_degree_c) < -2 ||
      parseFloat(formData.temperature_degree_c) > 30
    ) {
      errors.temperature_degree_c = 'Temperature must be between -2 and 30°C';
    }

    if (!formData.salinity_psu) {
      errors.salinity_psu = 'Salinity is required';
    } else if (
      isNaN(formData.salinity_psu) ||
      parseFloat(formData.salinity_psu) < 25 ||
      parseFloat(formData.salinity_psu) > 35
    ) {
      errors.salinity_psu = 'Salinity must be between 25 and 35 PSU';
    }

    if (formData.latitude && (isNaN(formData.latitude) || parseFloat(formData.latitude) < 44.5 || parseFloat(formData.latitude) > 44.8)) {
      errors.latitude = 'Latitude must be between 44.5 and 44.8';
    }

    if (formData.longitude && (isNaN(formData.longitude) || parseFloat(formData.longitude) < -63.7 || parseFloat(formData.longitude) > -63.4)) {
      errors.longitude = 'Longitude must be between -63.7 and -63.4';
    }

    if ((formData.latitude && !formData.longitude) || (!formData.latitude && formData.longitude)) {
      errors.latitude = errors.longitude = 'Both latitude and longitude must be provided or neither';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the errors in the form before submitting.');
      setLoading(false);
      return;
    }

    const data = {
      temperature_degree_c: parseFloat(formData.temperature_degree_c),
      salinity_psu: parseFloat(formData.salinity_psu),
      season: formData.season,
    };
    if (formData.latitude && formData.longitude) {
      data.latitude = parseFloat(formData.latitude);
      data.longitude = parseFloat(formData.longitude);
    }

    try {
      if (!token) {
        throw new Error('Authentication token not available. Please sign out and sign in again.');
      }
      const response = await axios.post(
        `${process.env.API_URL}/predict`,
        data,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setPrediction(response.data);
      setError(null);
    } catch (error) {
      console.error('Prediction error:', error.response ? error.response.data : error);
      setError(error.response?.data?.error || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      temperature_degree_c: '',
      salinity_psu: '32.5',
      season: 'Spring',
      latitude: '',
      longitude: '',
    });
    setPrediction(null);
    setError(null);
    setValidationErrors({});
  };

  const isFormValid = () =>
    formData.temperature_degree_c &&
    !isNaN(formData.temperature_degree_c) &&
    parseFloat(formData.temperature_degree_c) >= -2 &&
    parseFloat(formData.temperature_degree_c) <= 30 &&
    formData.salinity_psu &&
    !isNaN(formData.salinity_psu) &&
    parseFloat(formData.salinity_psu) >= 25 &&
    parseFloat(formData.salinity_psu) <= 35 &&
    (!formData.latitude || (parseFloat(formData.latitude) >= 44.5 && parseFloat(formData.latitude) <= 44.8)) &&
    (!formData.longitude || (parseFloat(formData.longitude) >= -63.7 && parseFloat(formData.longitude) <= -63.4)) &&
    (formData.latitude ? !!formData.longitude : !formData.longitude);

  return (
    <div className="p-4 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Fishiko: Fishing Zone Recommender</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Temperature (°C)</label>
          <input
            type="number"
            name="temperature_degree_c"
            value={formData.temperature_degree_c}
            onChange={handleChange}
            placeholder="e.g., 15.0"
            step="any"
            className={`mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white ${
              validationErrors.temperature_degree_c ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.temperature_degree_c && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.temperature_degree_c}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salinity (PSU)</label>
          <input
            type="number"
            name="salinity_psu"
            value={formData.salinity_psu}
            onChange={handleChange}
            placeholder="e.g., 31.5"
            step="any"
            className={`mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white ${
              validationErrors.salinity_psu ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.salinity_psu && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.salinity_psu}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white border-gray-300"
          >
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Location</label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drop a pin on the map or enter coordinates manually (Halifax bounds: lat 44.5–44.8, lon -63.7–-63.4).
          </p>
          <PinDropMap setCoordinates={handleCoordinatesChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="e.g., 44.67"
            step="any"
            className={`mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white ${
              validationErrors.latitude ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.latitude && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.latitude}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="e.g., -63.58"
            step="any"
            className={`mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white ${
              validationErrors.longitude ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.longitude && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.longitude}</p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || loading}
            className={`p-2 w-full text-white rounded-md ${
              isFormValid() && !loading
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>
          <button
            onClick={handleReset}
            className="p-2 w-full text-white bg-gray-500 hover:bg-gray-600 rounded-md"
          >
            Reset
          </button>
        </div>
      </div>
      {error && <p className="mt-4 text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}
      {prediction && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Prediction Result</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Predicted Zone:</strong> {prediction.predicted_zone}</p>
            <p><strong>GPS Zone:</strong> {prediction.gps_zone}</p>
            <p><strong>Fish:</strong> {prediction.fish_recommendations.join(', ')}</p>
            <p><strong>Area:</strong> {prediction.area_name}</p>
            <p><strong>Latitude:</strong> {prediction.lat}</p>
            <p><strong>Longitude:</strong> {prediction.lon}</p>
            <p><strong>Radius:</strong> {prediction.radius_km} km</p>
          </div>
          {prediction.fish_recommendations && prediction.fish_recommendations.length > 0 && fishingTips[prediction.fish_recommendations[0]] && (
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-white">Fishing Tips for {prediction.fish_recommendations[0]}</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li><strong>Bait:</strong> {fishingTips[prediction.fish_recommendations[0]].bait}</li>
                <li><strong>Best Time:</strong> {fishingTips[prediction.fish_recommendations[0]].time}</li>
                <li><strong>Gear:</strong> {fishingTips[prediction.fish_recommendations[0]].gear}</li>
              </ul>
            </div>
          )}
          <MapDisplay zone={prediction.gps_zone.replace('Zone ', '')} />
        </div>
      )}
    </div>
  );
}

export default PredictionForm;
