import google.generativeai as genai
from google.generativeai.types import GenerateContentResponse
import re, os  # Import thư viện regex để trích xuất điểm số

# Cấu hình API key
API_KEY=os.getenv("API_KEY")
genai.configure(api_key=API_KEY)

# Cấu hình cho model Gemini
GENERATION_CONFIG = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 1024 * 10,  # Tối đa số token đầu ra
}

MODEL_NAME = "gemini-1.5-pro"  # Model name hợp lệ (đã kiểm tra)

def extract_scores_from_response(response_text: str):
    """
    Extract overall_score, tech_stack, experience, language, and leadership scores using regex.
    """
    scores = {}
    patterns = {
        "overall_score": r"overall_score:\s*([\d\.]+)",
        "tech_stack": r"tech_stack:\s*([\d\.]+)",
        "experience": r"experience:\s*([\d\.]+)",
        "language": r"language:\s*([\d\.]+)",
        "leadership": r"leadership:\s*([\d\.]+)"
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, response_text)
        scores[key] = float(match.group(1)) if match else 0.0

    return scores

def invoke_gemini_api(prompt: str) -> dict:
    """
    Gửi prompt tới API Gemini và xử lý kết quả trả về.
    Trả về một dictionary gồm `overall_score` và `details`.
    """
    # Thiết lập model với tên và cấu hình
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=GENERATION_CONFIG
    )

    # Chuẩn bị prompt
    prompt_parts = [
        prompt,
        "Please put the 'Overall Match Score: [score]' at the beginning of your response!"
    ]

    try:
        # Gửi prompt tới Gemini
        response: GenerateContentResponse = model.generate_content(prompt_parts)

        # Xử lý kết quả trả về
        result_text = response._result.candidates[0].content.parts[0].text
        print("result_text",result_text)
        # Trích xuất điểm số từ response_text bằng hàm hỗ trợ
        scores = extract_scores_from_response(result_text)
        # print("scores", scores)

        # Trả về kết quả dưới dạng dictionary
        return {
          "overall_score": scores.get("overall_score", 0),
          "tech_stack": scores.get("tech_stack", 0),
          "experience": scores.get("experience", 0),
          "language": scores.get("language", 0),
          "leadership": scores.get("leadership", 0),
        }

    except Exception as e:
        raise Exception(f"Error while processing the Gemini response: {str(e)}")

# Kiểm tra nếu chạy file trực tiếp
if __name__ == "__main__":
    test_prompt = """
    Evaluate a Job Description (JD) against a CV based on:
    - Tech Stack
    - experience
    - language
    - leadership

    Return the following:
    Overall Match Score: <score>
    tech_stack: <score>
    experience: <score>
    language: <score>
    leadership: <score>
    """

    result = invoke_gemini_api(test_prompt)
    print("Response from Gemini API:", result)
