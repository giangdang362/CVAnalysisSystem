from app.core.extractor import read_word_file
from pathlib import Path

# Đường dẫn đến file Word hướng dẫn
PROMPT_GUIDE_PATH = Path("app/configs/prompt_guide.docx")

def generate_prompt_for_cv_to_jd() -> str:
    """
    Tạo prompt để so sánh 1 CV với danh sách JD, sử dụng nội dung từ file Word làm phần hướng dẫn.
    """
    try:
        guide_text = read_word_file(PROMPT_GUIDE_PATH)  # Đọc nội dung từ file Word
    except RuntimeError as e:
        guide_text = "Unable to load guide from Word file. Proceeding without it."

    return f"{guide_text}"


def generate_prompt_for_jd_to_cv() -> str:
    """
    Tạo prompt để so sánh 1 JD với danh sách CV, sử dụng nội dung từ file Word làm phần hướng dẫn.
    """
    try:
        guide_text = read_word_file(PROMPT_GUIDE_PATH)  # Đọc nội dung từ file Word
    except RuntimeError as e:
        guide_text = "Unable to load guide from Word file. Proceeding without it."
    
    return f"{guide_text}"
