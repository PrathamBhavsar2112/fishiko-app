import boto3
from sagemaker.sklearn.model import SKLearnModel
from sagemaker import get_execution_role

sagemaker_client = boto3.client('sagemaker')
role = get_execution_role()

model = SKLearnModel(
    model_data='s3://fishiko-model-bucket/models/model.tar.gz',
    role=role,
    entry_point='inference.py',
    framework_version='1.0-1',
    py_version='py3'
)

endpoint_name = 'fishiko-endpoint'
try:
    response = sagemaker_client.describe_endpoint(EndpointName=endpoint_name)
    if response['EndpointStatus'] == 'Failed':
        print(f"Endpoint {endpoint_name} is in Failed state, deleting...")
        sagemaker_client.delete_endpoint(EndpointName=endpoint_name)
        sagemaker_client.delete_endpoint_config(EndpointConfigName=endpoint_name)
        print(f"Creating new endpoint {endpoint_name}...")
        predictor = model.deploy(
            initial_instance_count=1,
            instance_type='ml.t2.medium',
            endpoint_name=endpoint_name
        )
    else:
        print(f"Endpoint {endpoint_name} exists, updating...")
        predictor = model.deploy(
            initial_instance_count=1,
            instance_type='ml.t2.medium',
            endpoint_name=endpoint_name,
            update_endpoint=True
        )
except sagemaker_client.exceptions.ClientError as e:
    if 'ValidationException' in str(e) and 'Could not find endpoint' in str(e):
        print(f"Creating new endpoint {endpoint_name}...")
        predictor = model.deploy(
            initial_instance_count=1,
            instance_type='ml.t2.medium',
            endpoint_name=endpoint_name
        )
    else:
        raise e

print(f"Endpoint deployed: {endpoint_name}")