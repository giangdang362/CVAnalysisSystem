from pathlib import Path
from app.core.extractor import extract_text_from_file

JD_DIR = Path("uploaded_files/jd")
JD_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại

def list_local_jds() -> list:
    """
    Lấy danh sách JD từ thư mục local.
    """
    jd_files = JD_DIR.glob("*")
    jd_texts = []
    for jd_file in jd_files:
        try:
            jd_texts.append({
                "jd_name": jd_file.stem,  # Tên file (không bao gồm đuôi)
                "file_path": str(jd_file),  # Đường dẫn đầy đủ
                "content": extract_text_from_file(str(jd_file))  # Nội dung JD
            })
        except Exception as e:
            print(f"Failed to read JD file {jd_file}: {str(e)}")
    return jd_texts
