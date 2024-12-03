from app.core.extractor import read_word_file
from pathlib import Path

# Đường dẫn đến file Word hướng dẫn
PROMPT_GUIDE_PATH = Path("app/configs/prompt_guide.docx")

def generate_prompt_for_cv_to_jd(cv_text: str, jd_texts: list[str]) -> str:
    """
    Tạo prompt để so sánh 1 CV với danh sách JD, sử dụng nội dung từ file Word làm phần hướng dẫn.
    """
    try:
        guide_text = read_word_file(PROMPT_GUIDE_PATH)  # Đọc nội dung từ file Word
    except RuntimeError as e:
        guide_text = "Unable to load guide from Word file. Proceeding without it."

    jd_summary = "\n\n".join(
        [f"Job Description {i+1}:\n{jd}" for i, jd in enumerate(jd_texts)]
    )
    return f"""
    {guide_text}
    
    JD Summaries:
    {jd_summary}
    
    CV Summary:
    {cv_text}
    
    Please calculate and return:
    - A match score (0-100) for each Key Grading Area.
    - An overall match score using the formula:
      (Tech stack score * 0.4) + (Experience score * 0.3) + (Language score * 0.2) + (Leadership score * 0.1)
    - Detailed reasoning and breakdown for each Key Grading Area.
    """


def generate_prompt_for_jd_to_cv(jd_text: str, cv_texts: list[str]) -> str:
    """
    Tạo prompt để so sánh 1 JD với danh sách CV, sử dụng nội dung từ file Word làm phần hướng dẫn.
    """
    try:
        guide_text = read_word_file(PROMPT_GUIDE_PATH)  # Đọc nội dung từ file Word
    except RuntimeError as e:
        guide_text = "Unable to load guide from Word file. Proceeding without it."

    cv_summary = "\n\n".join(
        [f"CV {i+1}:\n{cv}" for i, cv in enumerate(cv_texts)]
    )
    return f"""
    {guide_text}
    
    JD Summary:
    {jd_text}
    
    CV Summaries:
    {cv_summary}
    
    Please calculate and return:
    - A match score (0-100) for each Key Grading Area.
    - An overall match score using the formula:
      (Tech stack score * 0.4) + (Experience score * 0.3) + (Language score * 0.2) + (Leadership score * 0.1)
    - Detailed reasoning and breakdown for each Key Grading Area.
    """
