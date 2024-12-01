from fastapi import APIRouter, HTTPException
from app.core.jd_manager import list_local_jds, sync_jds_from_api

router = APIRouter()

@router.get("/list/")
async def get_all_jds():
    """
    API: Lấy danh sách JD từ local
    """
    return list_local_jds()

@router.post("/sync/")
async def sync_jds(api_url: str):
    """
    API: Đồng bộ JD từ API và lưu về local
    """
    try:
        result = sync_jds_from_api(api_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
