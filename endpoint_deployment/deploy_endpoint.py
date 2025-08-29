import boto3
from sagemaker.sklearn.model import SKLearnModel
from sagemaker import get_execution_role


sagemaker_client = boto3.client('sagemaker')
role = get_execution_role() 

model = SKLearnModel(
    model_data='s3://fishiko-model-bucket/model.tar.gz',
    role=role,
    entry_point='inference.py',
    framework_version='1.0-1',
    py_version='py3'
)

# Deploy endpoint
predictor = model.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium',
    endpoint_name='fishiko-endpoint'
)
print("Endpoint deployed: fishiko-endpoint")