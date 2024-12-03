from pathlib import Path
from app.core.extractor import extract_text_from_file

CV_DIR = Path("uploaded_files/cv")
CV_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại

def list_local_cvs() -> list:
    """
    Lấy danh sách CV từ thư mục local.
    """
    cv_files = CV_DIR.glob("*")
    cv_texts = []
    for cv_file in cv_files:
        try:
            cv_texts.append({
                "cv_name": cv_file.stem,  # Tên file (không bao gồm đuôi)
                "file_path": str(cv_file),  # Đường dẫn đầy đủ
                "content": extract_text_from_file(str(cv_file))  # Nội dung CV
            })
        except Exception as e:
            print(f"Failed to read CV file {cv_file}: {str(e)}")
    return cv_texts
