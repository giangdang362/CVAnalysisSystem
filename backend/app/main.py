from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import analyze, jd_endpoints
from app.core.jd_manager import sync_jds_from_api

# Biến cấu hình để bật/tắt đồng bộ JD
ENABLE_SYNC_JD = True

app = FastAPI(
    title="CV Analysis System",
    description="System for analyzing and ranking CVs based on Job Descriptions (JD)",
    version="1.0.0",
)

# Thêm middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả nguồn (chỉ nên dùng trong phát triển)
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức HTTP
    allow_headers=["*"],  # Cho phép tất cả headers
)

# Route mặc định cho root URL
@app.get("/")
async def root():
    """
    Route mặc định để kiểm tra hệ thống hoạt động
    """
    return {"message": "Welcome to CV Analysis System"}

# Đăng ký các router
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze"])
app.include_router(jd_endpoints.router, prefix="/jd", tags=["Job Descriptions"])

# Đồng bộ JD từ API khi khởi động
@app.on_event("startup")
async def sync_jds_on_startup():
    """
    Tự động đồng bộ JD từ API bên ngoài khi khởi động hệ thống
    """
    if ENABLE_SYNC_JD:
        api_url = "http://127.0.0.1:8000/api/get_jds"  # URL đầy đủ
        try:
            result = sync_jds_from_api(api_url)
            print(f"JD sync completed: {result}")
        except Exception as e:
            print(f"Failed to sync JD on startup. Error: {str(e)}")  # Báo lỗi nếu đồng bộ thất bại
    else:
        print("JD sync is disabled on startup.")
