from fastapi import APIRouter, UploadFile, HTTPException
from pathlib import Path
from app.core.extractor import extract_text_from_file
from app.core.ranker import rank_cvs_with_jd
from app.core.cv_service import list_local_cvs

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

@router.post("/")
async def analyze_jd(jd_file: UploadFile):
    """
    Phân tích JD và so sánh với danh sách CV từ local.
    """
    # Kiểm tra định dạng file
    file_extension = Path(jd_file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed."
        )

    # Đọc nội dung JD
    try:
        jd_text = extract_text_from_file(jd_file.file)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text from JD. Error: {str(e)}"
        )

    # Lấy danh sách CV từ local
    cv_list = list_local_cvs()
    if not cv_list:
        raise HTTPException(
            status_code=500,
            detail="No CV available in local storage."
        )

    cv_texts = [cv["content"] for cv in cv_list]

    # So sánh JD với danh sách CV và xếp hạng
    try:
        ranked_cvs = rank_cvs_with_jd(jd_text, cv_texts)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to rank CVs with JD. Error: {str(e)}"
        )

    return {
        "message": "JD analyzed successfully",
        "ranked_cvs": ranked_cvs
    }
