import boto3
import json
import os
from botocore.exceptions import BotoCoreError, ClientError

# Load environment variables (optional if needed)
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")  # Update your AWS region here
MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# Initialize Bedrock client
def get_bedrock_client():
    try:
        return boto3.client("bedrock-runtime", region_name='us-east-1')
    except (BotoCoreError, ClientError) as e:
        return None

# Function to call Claude 3.5 Sonnet API
def call_claude_api(prompt: str, max_tokens: int = 200, temperature: float = 1.0):
    client = get_bedrock_client()

    if not client:
        return {"error": "Failed to initialize Bedrock client"}

    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "top_k": 250,
        "top_p": 0.999,
        "temperature": temperature,
        "stop_sequences": [],
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": prompt}]
            }
        ]
    }

    try:
        response = client.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(payload)
        )
        result = json.loads(response["body"].read())
        llmOutput = result.get("content")[0]["text"]
        return llmOutput

    except (BotoCoreError, ClientError) as e:
        return {"error": str(e)}

# Main function
if __name__ == "__main__":
    prompt = """
    You are tasked with summarizing this text:
    'Artificial Intelligence is revolutionizing industries worldwide by automating tasks and
    generating insights from vast data...'
    """
    max_tokens = 300
    temperature = 0.8

    response = call_claude_api(prompt, max_tokens, temperature)

