import boto3
import json

runtime = boto3.client('sagemaker-runtime')
test_input = {
    'latitude': 44.6,  
    'longitude': -63.6,
    'temperature': 12.0,
    'salinity': 32.5,
    'season': 'Spring'
}

response = runtime.invoke_endpoint(
    EndpointName='fishiko-endpoint',
    ContentType='application/json',
    Body=json.dumps(test_input)
)

result = json.loads(response['Body'].read().decode())
print("Prediction:", result) 