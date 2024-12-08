from fastapi import APIRouter, HTTPException, UploadFile
from pathlib import Path
import shutil
from app.core.extractor import extract_text_from_file, extract_text_from_word, extract_text_from_pdf, extract_text_from_txt
from app.core.ranker import rank_jds_with_cv
from app.core.cv_service import list_local_cvs
from io import BytesIO
from app.core.jd_service import list_local_jds

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

@router.get("/list")
async def get_cv_list():
    """
    Lấy danh sách tất cả các CV từ local.
    """
    try:
        cv_list = list_local_cvs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get CV list. Error: {str(e)}")

    return {
        "message": "CV list retrieved successfully",
        "data": cv_list,
        "count": len(cv_list),
    }

@router.post("/analyze/")
async def analyze_cv(file: UploadFile):
    """
    Upload file CV, đọc nội dung và thực hiện phân tích CV so với danh sách JD.
    """
    # Kiểm tra định dạng file thông qua file.filename
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed.")
    
    # Đọc nội dung CV
    try:
        # Đọc trực tiếp từ file SpooledTemporaryFile
        file_content = await file.read()  # Đọc nội dung file dưới dạng byte
        file_io = BytesIO(file_content)  # Chuyển byte thành stream để xử lý với hàm extract_text_from_file
        
        # Chọn đúng phương thức xử lý cho từng loại file
        if file_extension == ".pdf":
            cv_text = extract_text_from_pdf(file_io)
        elif file_extension == ".docx":
            cv_text = extract_text_from_word(file_io)
        elif file_extension == ".txt":
            cv_text = extract_text_from_txt(file_io)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type for extraction.")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from CV. Error: {str(e)}")

    # Lấy danh sách JD từ local
    jd_list = list_local_jds()
    if not jd_list:
        return {
            "message": "No JD available in local storage.",
            "data": [],
            "count": 0,
        }

    jd_list_to_ranks = [{"content": jd["content"], "name": Path(jd["file_path"]).stem} for jd in jd_list]

    # So sánh CV với danh sách JD và xếp hạng
    try:
        ranked_jds = rank_jds_with_cv(cv_text, jd_list_to_ranks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rank JDs with CV. Error: {str(e)}")

    return {
        "message": "Successfully",
        "data": ranked_jds,
        "count": len(ranked_jds),
    }