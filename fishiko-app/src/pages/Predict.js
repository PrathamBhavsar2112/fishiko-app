import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import { useNavigate } from 'react-router-dom';

function Predict({ token }) {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handlePrediction = async (formData) => {
    setError(null);
    try {
      const response = await fetch(`${process.env.API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Prediction failed');
      const result = await response.json();
      const predictedFish = result.fish; 
      setPrediction(predictedFish);

      navigate(`/gear-guide?fish=${predictedFish}`);
    } catch (err) {
      setError('Error fetching prediction. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Predict Fishing Zone</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {prediction && <p className="text-green-500 mb-4">Predicted Fish: {prediction}</p>}
      <PredictionForm token={token} onPredict={handlePrediction} />
    </div>
  );
}

export default Predict;
