import json
import joblib
import numpy as np

def model_fn(model_dir):
    """Load the model and encoder from the model directory."""
    try:
        model = joblib.load(f'{model_dir}/fishiko_model_updated.pkl')
        season_encoder = joblib.load(f'{model_dir}/season_encoder.pkl')
        return {'model': model, 'season_encoder': season_encoder}
    except Exception as e:
        raise Exception(f"Error loading model or encoder: {str(e)}")

# Halifax zone coordinates
ZONES = {
    'Zone A': {'lat': 44.69, 'lon': -63.60, 'radius_km': 5, 'area_name': 'Near Bedford Basin'},
    'Zone B': {'lat': 44.66, 'lon': -63.56, 'radius_km': 7, 'area_name': 'Near Point Pleasant'},
    'Zone C': {'lat': 44.63, 'lon': -63.53, 'radius_km': 10, 'area_name': 'Near McNabs Island'}
}

# Fish species by zone, season, temperature, salinity
FISH_SPECIES = {
    'Zone A': {
        'Spring': {'temp_range': (4, 15), 'salinity_range': (30, 33), 'species': ['Cod', 'Flounder', 'Herring']},
        'Summer': {'temp_range': (15, 25), 'salinity_range': (31, 34), 'species': ['Mackerel', 'Pollock', 'Haddock']}
    },
    'Zone B': {
        'Spring': {'temp_range': (4, 15), 'salinity_range': (30, 33), 'species': ['Cod', 'Herring', 'Hake']},
        'Summer': {'temp_range': (15, 25), 'salinity_range': (31, 34), 'species': ['Mackerel', 'Haddock', 'Bluefish']}
    },
    'Zone C': {
        'Spring': {'temp_range': (4, 15), 'salinity_range': (30, 33), 'species': ['Flounder', 'Herring', 'Pollock']},
        'Summer': {'temp_range': (15, 25), 'salinity_range': (31, 34), 'species': ['Mackerel', 'Haddock', 'Tuna']}
    }
}

def input_fn(request_body, request_content_type):
    if request_content_type != 'application/json':
        raise ValueError(f"Unsupported content type: {request_content_type}")
    try:
        data = json.loads(request_body)
        required_fields = ["temperature_degree_c", "salinity_psu", "season"]
        if "latitude" in data and "longitude" in data:
            required_fields.extend(["latitude", "longitude"])
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing field: {field}")
        if data["season"] not in ["Spring", "Summer", "Fall", "Winter"]:
            raise ValueError(f"Invalid season: {data['season']}")
        return data
    except Exception as e:
        raise Exception(f"Error parsing input: {str(e)}")

def predict_fn(input_data, model_dict):
    try:
        model = model_dict['model']
        season_encoder = model_dict['season_encoder']
        
        temperature = float(input_data['temperature_degree_c'])
        salinity = float(input_data.get('salinity_psu', 32.5))
        season = input_data['season']
        latitude = input_data.get('latitude')
        longitude = input_data.get('longitude')

        try:
            season_encoded = season_encoder.transform([season])[0]
        except Exception as e:
            raise ValueError(f"Error encoding season: {str(e)}")
        features = np.array([[temperature, salinity, season_encoded]])
        predicted_zone = model.predict(features)[0]

        # Determine GPS zone
        gps_zone = predicted_zone
        if latitude is not None and longitude is not None:
            lat, lon = float(latitude), float(longitude)
            # Validate Halifax bounds
            if 44.5 <= lat <= 44.8 and -63.7 <= lon <= -63.4:
                distances = {
                    zone: ((ZONES[zone]['lat'] - lat) ** 2 + (ZONES[zone]['lon'] - lon) ** 2) ** 0.5
                    for zone in ZONES
                }
                gps_zone = min(distances, key=distances.get)
            else:
                lat, lon = ZONES[predicted_zone]['lat'], ZONES[predicted_zone]['lon']
        else:
            lat, lon = ZONES[predicted_zone]['lat'], ZONES[predicted_zone]['lon']

        # Get fish species
        fish_info = FISH_SPECIES.get(gps_zone, {}).get(season, {})
        species = fish_info.get('species', ['Unknown'])
        if not (
            fish_info.get('temp_range', (0, 100))[0] <= temperature <= fish_info.get('temp_range', (0, 100))[1] and
            fish_info.get('salinity_range', [0, 100])[0] <= salinity <= fish_info.get('salinity_range', (0, 100))[1]
        ):
            species = ['None']

        return {
            'predicted_zone': predicted_zone,
            'fish_recommendations': species,
            'gps_zone': gps_zone,
            'lat': lat,
            'lon': lon,
            'radius_km': ZONES[gps_zone]['radius_km'],
            'area_name': ZONES[gps_zone]['area_name']
        }
    except Exception as e:
        raise Exception(f"Error in prediction: {str(e)}")

def output_fn(prediction, accept):
    if accept != 'application/json':
        raise ValueError(f"Unsupported accept type: {accept}")
    return json.dumps(prediction), "application/json"