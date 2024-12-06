from pathlib import Path
from app.core.extractor import extract_text_from_file
from io import BytesIO  # Đảm bảo import BytesIO

CV_DIR = Path("uploaded_files/cv")
CV_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại

def list_local_cvs() -> list:
    """
    Lấy danh sách CV từ thư mục local, bao gồm cả thư mục con.
    """
    cv_files = CV_DIR.rglob("*")  # Sử dụng rglob để tìm tất cả các file trong thư mục và thư mục con
    cv_texts = []
    for cv_file in cv_files:
        if cv_file.is_file():  # Kiểm tra xem đối tượng là file (không phải thư mục)
            try:
                with cv_file.open('rb') as f:  # Mở file ở dạng binary
                    file_content = BytesIO(f.read())  # Chuyển byte thành BytesIO
                    cv_texts.append({
                        "name": cv_file.stem,  # Tên file (không bao gồm đuôi)
                        "file_path": str(cv_file),  # Đường dẫn đầy đủ
                        "content": extract_text_from_file(file_content)  # Nội dung CV từ stream
                    })
            except Exception as e:
                print(f"Failed to read CV file {cv_file}: {str(e)}")
    return cv_texts
