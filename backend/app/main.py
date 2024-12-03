from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import analyze_cv, analyze_jd, upload

app = FastAPI(
    title="CV and JD Analysis System",
    description="System for analyzing CVs and JDs with AI",
    version="1.0.0",
)

# Thêm middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép mọi nguồn (chỉ nên dùng trong phát triển)
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép mọi phương thức HTTP
    allow_headers=["*"],  # Cho phép mọi headers
)

# Route mặc định
@app.get("/")
async def root():
    return {"message": "Welcome to CV and JD Analysis System"}

# Đăng ký các router
app.include_router(analyze_cv.router, prefix="/analyze/cv", tags=["Analyze CV"])
app.include_router(analyze_jd.router, prefix="/analyze/jd", tags=["Analyze JD"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
