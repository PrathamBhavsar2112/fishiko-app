import React from 'react';
import { Link } from 'react-router-dom';
import { MapIcon, BoltIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

function Home() {
  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-in;
          }
        `}
      </style>

      <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Welcome to Fishiko
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Discover the best fishing zones in Halifax with our advanced prediction tool. Enter your
              environmental data and let Fishiko recommend the perfect spot for your next catch!
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
              Why Choose Fishiko?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                <BoltIcon className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Accurate Predictions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Leverage machine learning to predict fishing zones based on temperature, salinity, and more.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                <MapIcon className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Interactive Maps
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Drop a pin on Halifax maps to select your location with ease.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                <DocumentTextIcon className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gear Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get tailored gear advice based on predicted fish species.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-gray-800 text-white py-6 px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-300 mb-2">
              © 2025 Fishiko. All rights reserved.
            </p>
            <div className="space-x-4">
              <Link to="/predict" className="text-gray-300 hover:text-white">Predict</Link>
              <Link to="/gear-guide" className="text-gray-300 hover:text-white">Gear Guide</Link>
              <Link to="/weather" className="text-gray-300 hover:text-white">Weather</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;