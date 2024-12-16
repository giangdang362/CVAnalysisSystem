# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose

Shows how to use the AWS SDK for Python (Boto3) with Amazon Bedrock to manage
Bedrock models.
"""

import logging
import boto3
from botocore.exceptions import ClientError
import json

logger = logging.getLogger(__name__)


# snippet-start:[python.example_code.bedrock.BedrockWrapper.class]
# snippet-start:[python.example_code.bedrock.BedrockWrapper.decl]
class BedrockWrapper:
    """Encapsulates Amazon Bedrock foundation model actions."""

    def __init__(self, bedrock_client):
        """
        :param bedrock_client: A Boto3 Amazon Bedrock client, which is a low-level client that
                               represents Amazon Bedrock and describes the API operations for
                               creating and managing Bedrock models.
        """
        self.bedrock_client = bedrock_client

    # snippet-end:[python.example_code.bedrock.BedrockWrapper.decl]

    # snippet-start:[python.example_code.bedrock.GetFoundationModel]
    def get_foundation_model(self, model_identifier):
        """
        Get details about an Amazon Bedrock foundation model.

        :return: The foundation model's details.
        """

        try:
            return self.bedrock_client.get_foundation_model(
                modelIdentifier=model_identifier
            )["modelDetails"]
        except ClientError:
            logger.error(
                f"Couldn't get foundation models details for {model_identifier}"
            )
            raise

    # snippet-end:[python.example_code.bedrock.GetFoundationModel]

    # snippet-start:[python.example_code.bedrock.ListFoundationModels]
    def list_foundation_models(self):
        """
        List the available Amazon Bedrock foundation models.

        :return: The list of available bedrock foundation models.
        """

        try:
            response = self.bedrock_client.list_foundation_models()
            models = response["modelSummaries"]
            logger.info("Got %s foundation models.", len(models))
            return models

        except ClientError:
            logger.error("Couldn't list foundation models.")
            raise

    # snippet-end:[python.example_code.bedrock.ListFoundationModels]


# snippet-end:[python.example_code.bedrock.BedrockWrapper.class]


def print_model_details(model):
    print("\n" + "=" * 42)
    print(f' Model: {model["modelId"]}')
    print("-" * 42)
    print(f' Name: {model["modelName"]}')
    print(f' Provider: {model["providerName"]}')
    print(f' Model ARN: {model["modelArn"]}')
    print(f' Lifecycle status: {model["modelLifecycle"]["status"]}')
    print(f' Input modalities: {model["inputModalities"]}')
    print(f' Output modalities: {model["outputModalities"]}')
    print(f' Supported customizations: {model["customizationsSupported"]}')
    print(f' Supported inference types: {model["inferenceTypesSupported"]}')
    if "responseStreamingSupported" in model:
        print(f' Response streaming supported: {model["responseStreamingSupported"]}')

    print("=" * 42)
def invoke_claude(
        prompt,
        model_id="anthropic.claude-3-5-sonnet-20240620-v1:0",
        max_tokens=1024
      ):     
    # Initialize the Bedrock client
    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-east-1'
    )          
    # Prepare the request body     
    request_body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': max_tokens,
        'temperature': 0.5,
        'messages': [
            {
                'role': 'user',
                'content': [
                    {
                        'type': 'text', 
                        'text': prompt
                    }
                ],
            }
        ],
    }     
    try: 
        # Invoke the model
        response = bedrock.invoke_model(
            modelId=model_id, 
            body=json.dumps(request_body)
        )

        # Parse the response
        response_body = json.loads(response.get('body').read())
        return response_body['content'][0]['text']
    except Exception as e:
        print(f"Error invoking Claude: {str(e)}")
        raise

if __name__ == "__main__":
    prompt = "What is the AI?"
    try:
        response = invoke_claude(prompt)
        print(f"Claude's response: {response}")
        # print(response)
    except Exception as e:
        print(f"Failed to get response from Claude: {str(e)}")