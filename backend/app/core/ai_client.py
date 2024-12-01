import openai
from app.configs.settings import API_KEY

openai.api_key = API_KEY

def analyze_with_gpt(prompt: str) -> dict:
    """
    Gửi prompt đến GPT/Gemini API và nhận kết quả
    """
    response = openai.Completion.create(
        model="text-davinci-003",  # Hoặc GPT-4
        prompt=prompt,
        max_tokens=1500
    )
    return eval(response.choices[0].text)  # Trả về kết quả dạng JSON
