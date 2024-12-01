from fastapi import APIRouter, HTTPException
from app.core.extractor import extract_text_from_pdf, extract_text_from_word
from app.core.ranker import rank_jds_with_cv
from app.core.jd_manager import list_local_jds
from pathlib import Path

router = APIRouter()
UPLOAD_DIR = Path("uploaded_files/cv")  # Thư mục chứa CV

@router.post("/")
async def analyze_cv():
    """
    Phân tích CV được upload gần nhất và so sánh với danh sách JD từ local.
    """
    # Lấy file CV mới nhất (nếu có)
    cv_files = list(UPLOAD_DIR.glob("*"))
    if not cv_files:
        raise HTTPException(
            status_code=400,
            detail="No CV file available. Please upload a CV first."
        )

    # Chỉ lấy file đầu tiên (do các file cũ đã bị xóa)
    cv_file_path = cv_files[0]
    if cv_file_path.suffix == ".pdf":
        cv_text = extract_text_from_pdf(cv_file_path)
    elif cv_file_path.suffix == ".docx":
        cv_text = extract_text_from_word(cv_file_path)
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF and DOCX are allowed."
        )

    # Lấy danh sách JD từ local
    jd_list = list_local_jds()
    if not jd_list:
        raise HTTPException(
            status_code=500,
            detail="No JD available in local storage."
        )

    jd_texts = [jd["content"] for jd in jd_list]

    # So sánh CV với từng JD và xếp hạng
    ranked_jds = rank_jds_with_cv(cv_text, jd_texts)

    return {"ranked_jds": ranked_jds}
