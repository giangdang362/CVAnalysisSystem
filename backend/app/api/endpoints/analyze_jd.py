from fastapi import APIRouter, HTTPException, UploadFile
from pathlib import Path
from io import BytesIO
from app.core.extractor import extract_text_from_file, extract_text_from_word, extract_text_from_pdf, extract_text_from_txt
from app.core.ranker import rank_cvs_with_jd
from app.core.cv_service import list_local_cvs
from app.core.jd_service import list_local_jds

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

@router.get("/list")
async def get_jd_list():
    """
    Lấy danh sách tất cả các JD từ local.
    """
    try:
        jd_list = list_local_jds()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get JD list. Error: {str(e)}")

    return {
        "message": "JD list retrieved successfully",
        "data": jd_list,
        "count": len(jd_list),
    }

@router.post("/analyze/")
async def analyze_jd(file: UploadFile):
    """
    Upload file JD, đọc nội dung và thực hiện phân tích JD so với danh sách CV.
    """
    # Kiểm tra định dạng file thông qua file.filename
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file format. Only PDF, DOCX, and TXT are allowed.")
    
    # Đọc nội dung JD
    try:
        # Đọc trực tiếp từ file SpooledTemporaryFile
        file_content = await file.read()  # Đọc nội dung file dưới dạng byte
        file_io = BytesIO(file_content)  # Chuyển byte thành stream để xử lý với hàm extract_text_from_file
        
        # Chọn đúng phương thức xử lý cho từng loại file
        if file_extension == ".pdf":
            jd_text = extract_text_from_pdf(file_io)
        elif file_extension == ".docx":
            jd_text = extract_text_from_word(file_io)
        elif file_extension == ".txt":
            jd_text = extract_text_from_txt(file_io)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type for extraction.")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from JD. Error: {str(e)}")

    # Lấy danh sách CV từ local
    cv_list = list_local_cvs()
    if not cv_list:
        return {
            "message": "No CV available in local storage.",
            "data": [],
            "count": 0,
        }

    cv_list_to_ranks = [{"content": cv["content"], "name": Path(cv["file_path"]).stem} for cv in cv_list]

    # So sánh JD với danh sách CV và xếp hạng
    try:
        ranked_cvs = rank_cvs_with_jd(jd_text, cv_list_to_ranks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rank CVs with JD. Error: {str(e)}")

    return {
        "message": "Successfully",
        "data": ranked_cvs,
        "count": len(ranked_cvs),
    }
