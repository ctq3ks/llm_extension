import os
import io
import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# grab environment variables
SAGEMAKER_ENDPOINT_NAME = os.environ['SAGEMAKER_ENDPOINT_NAME']
runtime=boto3.client('runtime.sagemaker')

def lambda_handler(event, context):
    response = runtime.invoke_endpoint(EndpointName=SAGEMAKER_ENDPOINT_NAME,
                                       ContentType='application/json',
                                       Body=json.dumps(event['body-json']),
                                       CustomAttributes="accept_eula=true")
    
    logger.info(response['Body'].read().decode().strip()[1:-1])
    result_strip_brackets = response['Body'].read().decode().strip()[1:-1]
    result_remove_whitespace = result_strip_brackets.strip()
    result = json.loads(result_remove_whitespace)
    
    return {
        "statusCode": 200,
        "body": json.dumps(result)
    }