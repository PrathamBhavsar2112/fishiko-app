import json
import boto3
import uuid
from datetime import datetime

runtime = boto3.client('sagemaker-runtime')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FishikoPredictions')
endpoint_name = 'fishiko-endpoint'

def lambda_handler(event, context):
    try:
        user_email = event['requestContext']['authorizer']['claims']['email']
        body = json.loads(event['body'])
        latitude = body.get('latitude')
        longitude = body.get('longitude')
        temperature = body['temperature_degree_c']  
        salinity = body.get('salinity_psu', 32.5)
        season = body['season']

        if latitude and longitude:
            lat = float(latitude)
            lon = float(longitude)
            if not (44.5 <= lat <= 44.8 and -63.7 <= lon <= -63.4):
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Coordinates outside Halifax bounds'})
                }
        else:
            lat, lon = None, None

        payload = {
            'temperature_degree_c': temperature,
            'salinity_psu': salinity,
            'season': season,
            'latitude': lat,
            'longitude': lon
        }
        response = runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType='application/json',
            Body=json.dumps(payload)
        )
        result = json.loads(response['Body'].read().decode())

        prediction_id = str(uuid.uuid4())
        table.put_item(
            Item={
                'PredictionID': prediction_id,
                'user_email': user_email,
                'latitude': str(lat) if lat else 'N/A',
                'longitude': str(lon) if lon else 'N/A',
                'temperature': str(temperature),
                'salinity': str(salinity),
                'season': season,
                'predicted_zone': result['predicted_zone'],
                'fish_recommendations': ', '.join(result['fish_recommendations']),
                'gps_zone': result['gps_zone'],
                'timestamp': datetime.utcnow().isoformat()
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }