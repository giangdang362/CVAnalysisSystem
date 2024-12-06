import google.generativeai as genai
from google.generativeai.types import GenerateContentResponse
from app.configs.settings import API_KEY
import re  # Import thư viện regex để trích xuất điểm số

# Configure the API key
genai.configure(api_key=API_KEY)

# Set up the model generation configuration
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

def analyze_with_gemini(prompt: str) -> dict:
    """
    Sends a prompt to the Gemini API and receives the result.
    Returns a dictionary with `overall_score` and `details` for ranking.
    """
    # Set up the model with name and configuration
    model = genai.GenerativeModel(
        model_name="gemini-pro",
        generation_config=generation_config
    )
    
    # Prepare the prompt
    prompt_parts = [prompt]

    # Generate content using the model
    response: GenerateContentResponse = model.generate_content(prompt_parts)
    
    # Assuming the response contains relevant data like 'overall_score' and 'details'
    try:
        result_text = response._result.candidates[0].content.parts[0].text

        # Tìm và trích xuất điểm số từ nội dung trả về của Gemini bằng regex
        score_match = re.search(r"Overall Match Score:\s*(\d+)", result_text)
        print(score_match)
        if score_match:
            score = int(score_match.group(1))  # Trích xuất và chuyển đổi điểm số thành kiểu int
        else:
            score = 0  # Nếu không tìm thấy điểm số, mặc định là 0
        
        details = result_text  # Toàn bộ văn bản trả về là chi tiết

        # Return the result as a dictionary
        return {
            "overall_score": score,
            "details": details,
        }

    except Exception as e:
        raise Exception(f"Error while processing the Gemini response: {str(e)}")
