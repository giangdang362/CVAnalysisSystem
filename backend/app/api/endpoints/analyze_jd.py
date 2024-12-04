from fastapi import APIRouter, HTTPException
from pathlib import Path
from app.core.extractor import extract_text_from_file
from app.core.ranker import rank_cvs_with_jd
from app.core.cv_service import list_local_cvs

router = APIRouter()

TEMP_DIR = Path("uploaded_files/temp")  # Thư mục lưu file tạm


@router.post("/")
async def analyze_jd(filename: str):
    """
    Phân tích JD từ thư mục tạm và so sánh với danh sách CV từ local.
    """
    # Lấy đường dẫn file trong thư mục tạm
    file_path = TEMP_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found in temporary storage.")

    # Đọc nội dung JD
    try:
        jd_text = extract_text_from_file(file_path)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text from JD. Error: {str(e)}"
        )

    # Lấy danh sách CV từ local
    cv_list = list_local_cvs()
    if not cv_list:
        return {
            "message": "No CV available in local storage.",
            "data": [],
            "count": 0,
        }

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
        "data": ranked_cvs,
        "count": len(ranked_cvs),
    }
