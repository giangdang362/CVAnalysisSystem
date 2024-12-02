from pathlib import Path
from app.core.extractor import extract_text_from_file
import requests

# Thư mục lưu trữ JD
JD_DIR = Path("uploaded_files/jd")
JD_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại


def list_local_jds() -> list:
    """
    Lấy danh sách JD từ thư mục local
    """
    jd_files = JD_DIR.glob("*")  # Lấy tất cả file trong thư mục JD
    jd_texts = []
    for jd_file in jd_files:
        try:
            jd_texts.append({
                "jd_name": jd_file.stem,  # Tên file (không bao gồm đuôi)
                "file_path": str(jd_file),  # Đường dẫn đầy đủ
                "content": extract_text_from_file(str(jd_file))  # Nội dung JD
            })
        except Exception as e:
            print(f"Failed to read JD file {jd_file}: {str(e)}")  # Log lỗi đọc file
    return jd_texts


def sync_jds_from_api(api_url: str) -> dict:
    """
    Đồng bộ JD từ API và lưu về local. Nếu gặp lỗi, trả về danh sách JD hiện có trong local.
    """
    try:
        # Gửi request đến API
        response = requests.get(api_url)
        response.raise_for_status()  # Kiểm tra lỗi HTTP
        jds = response.json()  # API trả về danh sách JD dạng JSON

        # Kiểm tra định dạng trả về từ API
        if not isinstance(jds, list) or not all("name" in jd and "content" in jd for jd in jds):
            return {"error": "Invalid data format received from API."}

        # Lưu từng JD vào thư mục local
        saved_count = 0
        for jd in jds:
            file_path = JD_DIR / f"{jd['name']}.txt"
            try:
                with open(file_path, "w", encoding="utf-8") as file:
                    file.write(jd["content"])
                saved_count += 1
            except Exception as e:
                print(f"Failed to save JD {jd['name']}: {str(e)}")

        return {"message": f"Synced {saved_count} JD(s) from API."}

    except requests.exceptions.RequestException as e:
        # Xử lý lỗi kết nối hoặc lỗi HTTP
        print(f"Failed to fetch JD from API. Error: {str(e)}")
        return {
            "error": f"Failed to fetch JD from API. Error: {str(e)}",
            "local_jds": list_local_jds()  # Trả về danh sách JD trong local
        }
    except Exception as e:
        # Xử lý lỗi khác
        print(f"An unexpected error occurred. Error: {str(e)}")
        return {
            "error": f"An unexpected error occurred. Error: {str(e)}",
            "local_jds": list_local_jds()  # Trả về danh sách JD trong local
        }
