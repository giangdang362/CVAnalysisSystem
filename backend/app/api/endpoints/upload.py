from fastapi import APIRouter, UploadFile, HTTPException
import shutil
from pathlib import Path

router = APIRouter()
UPLOAD_DIR = Path("uploaded_files/cv")  # Thư mục chứa CV
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại

ALLOWED_EXTENSIONS = {".pdf", ".docx"}  # Chỉ cho phép file PDF hoặc Word

@router.post("/")
async def upload_cv(cv_file: UploadFile):
    """
    Upload CV mới và xóa các CV cũ trong local.
    """
    # Kiểm tra định dạng file
    file_extension = Path(cv_file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF and DOCX are allowed."
        )

    # Xóa tất cả file CV cũ trong thư mục
    try:
        for old_file in UPLOAD_DIR.glob("*"):
            old_file.unlink()  # Xóa file
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to remove old CV files. Error: {str(e)}"
        )

    # Lưu file mới
    file_path = UPLOAD_DIR / cv_file.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(cv_file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save new CV file. Error: {str(e)}"
        )

    return {"message": f"File {cv_file.filename} uploaded successfully", "file_path": str(file_path)}
