from fastapi import APIRouter, UploadFile, HTTPException
from pathlib import Path
from app.core.extractor import extract_text_from_file
from app.core.ranker import rank_jds_with_cv
from app.core.jd_service import list_local_jds

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

@router.post("/")
async def analyze_cv(cv_file: UploadFile):
    """
    Phân tích CV và so sánh với danh sách JD từ local.
    """
    # Kiểm tra định dạng file
    file_extension = Path(cv_file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed."
        )

    # Đọc nội dung CV
    try:
        cv_text = extract_text_from_file(cv_file.file)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text from CV. Error: {str(e)}"
        )

    # Lấy danh sách JD từ local
    jd_list = list_local_jds()
    if not jd_list:
        return {
            "message": "No JD available in local storage.",
            "data": [],
            "count": 0,
        }

    jd_texts = [jd["content"] for jd in jd_list]

    # So sánh CV với danh sách JD và xếp hạng
    try:
        ranked_jds = rank_jds_with_cv(cv_text, jd_texts)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to rank JDs with CV. Error: {str(e)}"
        )

    return {
        "message": "CV analyzed successfully",
        "data": ranked_jds,
        "count": len(ranked_jds),
    }
