from app.core.extractor import read_word_file
from pathlib import Path

# Đường dẫn đến file Word hướng dẫn
PROMPT_GUIDE_PATH = Path("app/configs/prompt_guide.docx")

def generate_prompt_for_cv_to_jd(cv_text: str, jd_summary: str) -> str:
    """
    Tạo prompt để so sánh 1 CV với danh sách JD, sử dụng nội dung từ file Word làm phần hướng dẫn.
    """
    try:
        guide_text = read_word_file(PROMPT_GUIDE_PATH)  # Đọc nội dung từ file Word
    except RuntimeError as e:
        guide_text = "Unable to load guide from Word file. Proceeding without it."

    return f"""

    {guide_text}
    
    CV Summary:
    {cv_text}

    JD Summaries:
    {jd_summary}
    
    Please calculate and return these score below in the first answer:
    *** Overall Match Score: [Score]
    Score detail: 
    - Tech stack: [Score]
    - experience: [Score]
    - language: [Score]
    - leadership: [Score]
    """


def generate_prompt_for_jd_to_cv(jd_text: str, cv_text: str) -> str:
    """
    Tạo prompt để so sánh 1 JD với danh sách CV, sử dụng nội dung từ file Word làm phần hướng dẫn.
    """
    try:
        guide_text = read_word_file(PROMPT_GUIDE_PATH)  # Đọc nội dung từ file Word
    except RuntimeError as e:
        guide_text = "Unable to load guide from Word file. Proceeding without it."
    
    return f"""

    {guide_text}
    
    JD Summaries:
    {jd_text}
    
    CV Summary:
    {cv_text}
    
    Please calculate and return these score below in the first answer:
    *** Overall Match Score: [Score]
    Score detail: 
    - Tech stack: [Score]
    - experience: [Score]
    - language: [Score]
    - leadership: [Score]
    """
