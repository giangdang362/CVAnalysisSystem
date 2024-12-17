import boto3
import json
import re
from botocore.exceptions import BotoCoreError, ClientError

MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# Initialize Bedrock client
def get_bedrock_client():
    try:
        return boto3.client("bedrock-runtime", region_name="us-east-1")
    except (BotoCoreError, ClientError) as e:
        return None

# Call Claude API and extract scores
def call_claude_api(prompt: str, max_tokens: int = 100):
    client = get_bedrock_client()

    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "temperature": 0.8,
        "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}],
    }

    try:
        response = client.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(payload),
        )
        result = json.loads(response["body"].read())
        llm_output = result.get("content", [{}])[0].get("text", "")

        # Extract scores using regex
        scores = extract_scores_from_response(llm_output)
        return scores

    except Exception as e:
        return {"error": str(e)}
    
def extract_scores_from_response(response_text: str):
    """
    Extract Overall_Score, Tech_Stack, Experience, Language, and Leadership scores using regex.
    """
    scores = {}
    patterns = {
        "Overall_Score": r"Overall_Score:\s*([\d\.]+)",
        "Tech_Stack": r"Tech_Stack:\s*([\d\.]+)",
        "Experience": r"Experience:\s*([\d\.]+)",
        "Language": r"Language:\s*([\d\.]+)",
        "Leadership": r"Leadership:\s*([\d\.]+)"
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, response_text)
        scores[key] = float(match.group(1)) if match else 0.0

    return scores