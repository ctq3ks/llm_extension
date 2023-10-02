import io
import boto3
import json
import logging
import os
import openai
import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

openai.organization = os.getenv("OPENAI_ORG_ID")
openai.api_key = os.getenv("OPENAI_API_KEY")

def lambda_handler(event, context):
    # Sample Response:
    # {
    #     "id": "chatcmpl-abc123",
    #     "object": "chat.completion",
    #     "created": 1677858242,
    #     "model": "gpt-3.5-turbo-0613",
    #     "usage": {
    #         "prompt_tokens": 13,
    #         "completion_tokens": 7,
    #         "total_tokens": 20
    #     },
    #     "choices": [
    #         {
    #             "message": {
    #                 "role": "assistant",
    #                 "content": "\n\nThis is a test!"
    #             },
    #             "finish_reason": "stop",
    #             "index": 0
    #         }
    #     ]
    # }
    
    # Transform the event input to context:
    logger.info(event)
    transform_event = f"This is the context of what the user is writting: {event['inputElementContent']}. This is also some additional context of the parsed html page: {event['parentElementsContent']}"

    openai_model = "gpt-3.5-turbo"
    openai_messages = [{"role": "system", "content": "You are helping to auto-complete the user's writting, use the user's context to generate the response but do ot refer to it directly."},
        {"role": "user", "content": transform_event},
    ]
    
    logger.info(openai_messages)
    
    chat_completion = openai.ChatCompletion.create(model=openai_model, messages=openai_messages, temperature=0)
    
    logger.info(chat_completion.choices[0].message.content)

    # response = requests.post(api_endpoint, json.dumps(api_body), headers=api_headers)

    result = chat_completion.choices[0].message.content
    
    return {
        "statusCode": 200,
        "body": result
    }