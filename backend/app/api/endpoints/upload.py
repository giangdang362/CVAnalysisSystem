from fastapi import APIRouter, UploadFile, HTTPException
from pathlib import Path
import shutil
from app.core.extractor import extract_text_from_pdf, extract_text_from_word
from app.core.cv_service import list_local_cvs
from app.core.jd_service import list_local_jds
from app.core.ranker import rank_jds_with_cv, rank_cvs_with_jd

router = APIRouter()

# Định nghĩa thư mục upload
CV_DIR = Path("uploaded_files/cv")
JD_DIR = Path("uploaded_files/jd")
CV_DIR.mkdir(parents=True, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại
JD_DIR.mkdir(parents=True, exist_ok=True)

# Định dạng file được phép
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@router.post("/cv/")
async def upload_and_analyze_cv(cv_file: UploadFile):
    """
    Upload CV và thực hiện phân tích so sánh với danh sách JD từ local.
    """
    # Kiểm tra định dạng file
    file_extension = Path(cv_file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed."
        )

    # Lưu file vào local
    file_path = CV_DIR / cv_file.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(cv_file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save CV file. Error: {str(e)}"
        )

    # Trích xuất nội dung CV
    try:
        if file_extension == ".pdf":
            cv_text = extract_text_from_pdf(file_path)
        elif file_extension == ".docx":
            cv_text = extract_text_from_word(file_path)
        elif file_extension == ".txt":
            with open(file_path, "r", encoding="utf-8") as f:
                cv_text = f.read()
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text from CV. Error: {str(e)}"
        )

    # Lấy danh sách JD từ local
    jd_list = list_local_jds()
    if not jd_list:
        raise HTTPException(status_code=500, detail="No JD available in local storage.")

    jd_texts = [jd["content"] for jd in jd_list]

    # So sánh CV với danh sách JD
    ranked_jds = rank_jds_with_cv(cv_text, jd_texts)

    return {
        "message": f"File {cv_file.filename} uploaded and analyzed successfully",
        "ranked_jds": ranked_jds
    }


@router.post("/jd/")
async def upload_and_analyze_jd(jd_file: UploadFile):
    """
    Upload JD và thực hiện phân tích so sánh với danh sách CV từ local.
    """
    # Kiểm tra định dạng file
    file_extension = Path(jd_file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed."
        )

    # Lưu file vào local
    file_path = JD_DIR / jd_file.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(jd_file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save JD file. Error: {str(e)}"
        )

    # Trích xuất nội dung JD
    try:
        if file_extension == ".pdf":
            jd_text = extract_text_from_pdf(file_path)
        elif file_extension == ".docx":
            jd_text = extract_text_from_word(file_path)
        elif file_extension == ".txt":
            with open(file_path, "r", encoding="utf-8") as f:
                jd_text = f.read()
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text from JD. Error: {str(e)}"
        )

    # Lấy danh sách CV từ local
    cv_list = list_local_cvs()
    if not cv_list:
        raise HTTPException(status_code=500, detail="No CV available in local storage.")

    cv_texts = [cv["content"] for cv in cv_list]

    # So sánh JD với danh sách CV
    ranked_cvs = rank_cvs_with_jd(jd_text, cv_texts)

    return {
        "message": f"File {jd_file.filename} uploaded and analyzed successfully",
        "ranked_cvs": ranked_cvs
    }
