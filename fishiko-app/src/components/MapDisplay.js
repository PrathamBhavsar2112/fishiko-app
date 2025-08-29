import React from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ZONES = {
  'A': { lat: 44.69, lon: -63.60, radius_km: 5, name: 'Near Bedford Basin' },
  'B': { lat: 44.66, lon: -63.56, radius_km: 7, name: 'Near Point Pleasant' },
  'C': { lat: 44.63, lon: -63.53, radius_km: 10, name: 'Near McNabs Island' },
};

function MapDisplay({ zone }) {
  const { lat, lon, radius_km, name } = ZONES[zone] || ZONES['B'];
  const position = [lat, lon];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Predicted Zone: {name}</h2>
      <MapContainer
        center={position}
        zoom={12}
        style={{ height: '300px', width: '100%', borderRadius: '8px', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <Circle
          center={position}
          radius={radius_km * 1000}
          pathOptions={{ color: 'blue', fillOpacity: 0.2 }}
        />
      </MapContainer>
    </div>
  );
}

export default MapDisplay;