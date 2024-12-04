from fastapi import APIRouter, UploadFile, HTTPException
from pathlib import Path
import shutil

router = APIRouter()

# Định nghĩa thư mục upload
TEMP_DIR = Path("uploaded_files/temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại

# Định dạng file được phép
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@router.post("/cv/")
async def upload_cv(cv_file: UploadFile):
    """
    Upload CV và lưu file vào thư mục tạm.
    """
    # Kiểm tra định dạng file
    file_extension = Path(cv_file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed."
        )

    # Lưu file vào thư mục tạm
    temp_file_path = TEMP_DIR / cv_file.filename
    try:
        with temp_file_path.open("wb") as buffer:
            shutil.copyfileobj(cv_file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save CV file. Error: {str(e)}"
        )

    return {
        "message": f"File {cv_file.filename} uploaded successfully",
        "file_path": str(temp_file_path)
    }


@router.post("/jd/")
async def upload_jd(jd_file: UploadFile):
    """
    Upload JD và lưu file vào thư mục tạm.
    """
    # Kiểm tra định dạng file
    file_extension = Path(jd_file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed."
        )

    # Lưu file vào thư mục tạm
    temp_file_path = TEMP_DIR / jd_file.filename
    try:
        with temp_file_path.open("wb") as buffer:
            shutil.copyfileobj(jd_file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save JD file. Error: {str(e)}"
        )

    return {
        "message": f"File {jd_file.filename} uploaded successfully",
        "file_path": str(temp_file_path)
    }
