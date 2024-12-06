from pathlib import Path
from app.core.extractor import extract_text_from_file
from io import BytesIO

JD_DIR = Path("uploaded_files/jd")
JD_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại

def list_local_jds() -> list:
    """
    Lấy danh sách JD từ thư mục local, bao gồm cả thư mục con.
    """
    jd_files = JD_DIR.rglob("*")  # Sử dụng rglob để tìm tất cả các file trong thư mục và thư mục con
    jd_texts = []
    for jd_file in jd_files:
        if jd_file.is_file():  # Kiểm tra xem đối tượng là file (không phải thư mục)
            try:
                with jd_file.open('rb') as f:  # Mở file ở dạng binary
                    file_content = BytesIO(f.read())  # Chuyển byte thành BytesIO
                    jd_texts.append({
                        "name": jd_file.stem,  # Tên file (không bao gồm đuôi)
                        "file_path": str(jd_file),  # Đường dẫn đầy đủ
                        "content": extract_text_from_file(file_content)  # Nội dung JD từ stream
                    })
            except Exception as e:
                print(f"Failed to read JD file {jd_file}: {str(e)}")
    return jd_texts
