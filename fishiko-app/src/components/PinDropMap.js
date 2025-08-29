import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
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

const PinDropMap = ({ setCoordinates }) => {
  const [position, setPosition] = useState(null);


  const halifaxBounds = [
    [44.5, -63.7], 
    [44.8, -63.4],
  ];

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (lat >= 44.5 && lat <= 44.8 && lng >= -63.7 && lng <= -63.4) {
          setPosition([lat, lng]);
          setCoordinates({ latitude: lat, longitude: lng });
        } else {
          alert('Please select a location within Halifax bounds (lat: 44.5–44.8, lon: -63.7–-63.4).');
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[44.65, -63.58]}
      zoom={12}
      style={{ height: '300px', width: '100%', borderRadius: '8px', zIndex: 0 }}
      bounds={halifaxBounds}
      maxBounds={halifaxBounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      {position && <Marker position={position} />}
      {Object.entries(ZONES).map(([zone, { lat, lon, radius_km }]) => (
        <React.Fragment key={zone}>
          <Circle
            center={[lat, lon]}
            radius={radius_km * 1000} 
            pathOptions={{ color: zone === 'B' ? 'blue' : 'gray', fillOpacity: 0.1 }}
          />
          <Marker position={[lat, lon]} />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default PinDropMap;