import React from 'react';
import { useLocation } from 'react-router-dom';

function GearGuide() {
  const gearRecommendations = {
    'Cod': {
      rod: 'Medium-heavy rod (20-30 lb line)',
      reel: 'Spinning reel (3000-4000 size)',
      bait: 'Squid or clams',
    },
    'Haddock': {
      rod: 'Light to medium rod (15-20 lb line)',
      reel: 'Spinning reel (2500-3000 size)',
      bait: 'Shrimp or small herring',
    },
    'Salmon': {
      rod: 'Medium rod (10-20 lb line)',
      reel: 'Baitcasting reel',
      bait: 'Spoons or spinners',
    },
    'Mackerel': {
      rod: 'Light rod (8-12 lb line)',
      reel: 'Spinning reel (2000-2500 size)',
      bait: 'Small jigs or feathers',
    },
    'Halibut': {
      rod: 'Heavy rod (50-80 lb line)',
      reel: 'Conventional reel (6000+ size)',
      bait: 'Herring or mackerel',
    },
  };


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const predictedFish = queryParams.get('fish'); 


  const sampleFish = predictedFish && gearRecommendations[predictedFish] ? [predictedFish] : ['Cod', 'Haddock'];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center tracking-tight">
        Fishing Gear Guide
      </h1>
      {sampleFish.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {sampleFish.map((fish) =>
            gearRecommendations[fish] ? (
              <div
                key={fish}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {fish} Gear Recommendations
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="font-medium text-gray-900 dark:text-gray-200 mr-2">Rod:</span>
                    <span>{gearRecommendations[fish].rod}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-gray-900 dark:text-gray-200 mr-2">Reel:</span>
                    <span>{gearRecommendations[fish].reel}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-gray-900 dark:text-gray-200 mr-2">Bait:</span>
                    <span>{gearRecommendations[fish].bait}</span>
                  </li>
                </ul>
              </div>
            ) : (
              <p
                key={fish}
                className="text-gray-600 dark:text-gray-400 text-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg"
              >
                No gear recommendations available for {fish}.
              </p>
            )
          )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg max-w-md mx-auto">
          No fish selected for gear recommendations.
        </p>
      )}
    </div>
  );
}

export default GearGuide;