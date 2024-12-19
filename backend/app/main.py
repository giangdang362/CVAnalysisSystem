from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from datetime import datetime
from app.models import CV, JD  # Assuming models are in app.models
from dotenv import load_dotenv
from docx import Document  # To handle docx files
from anthropic import HUMAN_PROMPT, AI_PROMPT  # For Claude API
# from app.invoke_bedrock import invoke_api
from app.invoke_gemini import invoke_gemini_api
import uuid, os, boto3
from fastapi.staticfiles import StaticFiles
from PyPDF2 import PdfReader
from pydantic import BaseModel
from typing import List
from botocore.exceptions import ClientError

# Load environment variables
load_dotenv()

# Database connection settings
DATABASE_URL = os.getenv("DATABASE_URL")

# S3 config
BUCKET_NAME = 'lts-4-aisayhi'
s3_client = boto3.client('s3')

# Initialize database engine and session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize FastAPI app
app = FastAPI(
    title="CV and JD Analysis System",
    description="System for analyzing CVs and JDs with AI",
    version="1.0.0",
)

# Add middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (not recommended in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File upload folder
PROMPT_FILE_OLD = "app/configs/prompt_guide.docx"
PROMPT_FILE= "app/configs/prompt.docx"

# Default route
@app.get("/")
async def root():
    return {"message": "Welcome to CV and JD Analysis System"}

@app.get("/cv/{id}", tags=["CV Management"])
async def get_cv_by_id(id: int, db: Session = Depends(get_db)):
    """
    Get details of a specific CV by ID.
    """
    try:
        cv = db.query(CV).filter(CV.id == id).first()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")
        return {"message": "success", "data": cv}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jd/{id}", tags=["JD Management"])
async def get_jd_by_id(id: int, db: Session = Depends(get_db)):
    """
    Get details of a specific JD by ID.
    """
    try:
        jd = db.query(JD).filter(JD.id == id).first()
        if not jd:
            raise HTTPException(status_code=404, detail="JD not found")
        return {"message": "success", "data": jd}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cv", tags=["CV Management"])
async def add_cv(
    name: str,
    applicant_name: str,
    expect_salary: int,
    education: str,
    role: str,
    recruiter: str,
    experience_summary: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Add a new CV and upload the file to S3"""
    try:
        # Gọi hàm hỗ trợ upload_file_s3 để upload file lên S3
        upload_result = await upload_file_s3(file, "cv")
        if "error" in upload_result:
            raise HTTPException(status_code=500, detail=upload_result["error"])

        # Lấy S3 path từ kết quả trả về của hàm upload_file_s3
        s3_path = upload_result["s3_path"]

        # Thêm CV record vào database
        new_cv = CV(
            name=name,
            applicant_name=applicant_name,
            path_file=s3_path,  # Lưu đường dẫn S3
            expect_salary=expect_salary,
            education=education,
            role=role,
            recruiter=recruiter,
            experience_summary=experience_summary,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(new_cv)
        db.commit()
        db.refresh(new_cv)

        return {"status": "success", "cv": new_cv}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/cv", tags=["CV Management"])
async def get_all_cvs(db: Session = Depends(get_db)):
    """Get a list of all CVs"""
    cvs = db.query(CV).all()
    return {"message": "success", "data": cvs, "count": len(cvs)}

@app.post("/jd", tags=["JD Management"])
async def add_jd(
    name: str,
    company_name: str,
    role: str,
    level: str,
    languages: str,
    technical_skill: str,
    requirement: str,
    description: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Add a new JD and upload the file to S3"""
    try:
        # Gọi hàm hỗ trợ upload_file_s3 để upload file lên S3
        upload_result = await upload_file_s3(file, "jd")
        if "error" in upload_result:
            raise HTTPException(status_code=500, detail=upload_result["error"])

        # Lấy S3 path từ kết quả trả về của hàm upload_file_s3
        s3_path = upload_result["s3_path"]

        # Thêm JD record vào database
        new_jd = JD(
            name=name,
            path_file=s3_path,  # Lưu đường dẫn S3
            company_name=company_name,
            role=role,
            level=level,
            languages=languages,
            technical_skill=technical_skill,
            requirement=requirement,
            description=description,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(new_jd)
        db.commit()
        db.refresh(new_jd)

        return {"status": "success", "jd": new_jd}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/jd", tags=["JD Management"])
async def get_all_jds(db: Session = Depends(get_db)):
    """Get a list of all JDs"""
    jds = db.query(JD).all()
    return {"message": "success", "data": jds, "count": len(jds)}

@app.post("/matching/cv-to-jds", tags=["Matching"])
async def match_cv_to_jds(cv_id: int, db: Session = Depends(get_db)):
    """Match a CV with JDs based on the role"""
    # Fetch the CV by id
    cv = db.query(CV).filter(CV.id == cv_id).first()
    if not cv:
        return {"message": "error", "detail": "CV not found"}

    # Find JDs that match the CV's role
    matching_jds = db.query(JD).filter(JD.role == cv.role).all()
    ids = [item.id for item in matching_jds]
    return {"message": "success", "data": matching_jds, "ids": ids, "count": len(matching_jds)}

@app.post("/matching/jd-to-cvs", tags=["Matching"])
async def match_jd_to_cvs(jd_id: int, db: Session = Depends(get_db)):
    """Match a JD with CVs based on the role"""
    # Fetch the JD by id
    jd = db.query(JD).filter(JD.id == jd_id).first()
    if not jd:
        return {"message": "error", "detail": "JD not found"}

    # Find CVs that match the JD's role
    matching_cvs = db.query(CV).filter(CV.role == jd.role).all()
    ids = [item.id for item in matching_cvs]
    return {"message": "success", "data": matching_cvs, "ids": ids, "count": len(matching_cvs)}

class RankRequest(BaseModel):
    cv_id: int
    jd_ids: List[int]
@app.post("/matching/cv-to-jds/rank", tags=["Matching"])
async def rank_cv_against_jds(payload: RankRequest, db: Session = Depends(get_db)):
    try:
        # Lấy CV từ DB
        cv = db.query(CV).filter(CV.id == payload.cv_id).first()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        # Lấy danh sách JD từ DB
        jds = db.query(JD).filter(JD.id.in_(payload.jd_ids)).all()
        if not jds:
            raise HTTPException(status_code=404, detail="No JDs found")

        # Đọc nội dung CV từ S3
        cv_text = ""
        if cv.path_file.lower().endswith(".pdf"):
            cv_text = read_pdf_from_s3(cv.path_file)
        elif cv.path_file.lower().endswith(".docx"):
            cv_text = read_docx_from_s3(cv.path_file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported CV file format")
        
        # Đọc nội dung Prompt từ file DOCX
        prompt_text = read_docx(PROMPT_FILE_OLD)

        results = []

        # Đọc nội dung JD từ S3 và thực hiện phân tích
        for jd in jds:
            jd_text = ""
            if jd.path_file.lower().endswith(".pdf"):
                jd_text = read_pdf_from_s3(jd.path_file)
            elif jd.path_file.lower().endswith(".docx"):
                jd_text = read_docx_from_s3(jd.path_file)
            else:
                raise HTTPException(status_code=400, detail="Unsupported JD file format")

            # Chuẩn bị prompt
            prompt = f"""
            You are tasked with evaluating a CV against a Job Description (JD) based on the following criteria: Tech Stack, experience, language, and leadership.
            {prompt_text}

            CV:
            {cv_text}

            JD:
            {jd_text}
            """

            # Gọi API phân tích
            response = invoke_gemini_api(prompt)
            
            if "error" in response:
                raise HTTPException(status_code=500, detail=response["error"])

            # Xây dựng kết quả
            result = {
                "name": jd.name,
                "overall_score": response.get("overall_score", 0),
                "tech_stack": response.get("tech_stack", 0),
                "experience": response.get("experience", 0),
                "language": response.get("language", 0),
                "leadership": response.get("leadership", 0),
            }
            results.append(result)

        # Sắp xếp kết quả theo điểm tổng thể (giảm dần)
        results.sort(key=lambda x: x["overall_score"], reverse=True)
        return {"message": "success", "data": results, "count": len(results)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RankJdToCvsRequest(BaseModel):
    jd_id: int
    cv_ids: List[int]
@app.post("/matching/jd-to-cvs/rank", tags=["Matching"])
async def rank_jd_against_cvs(
    payload: RankJdToCvsRequest, db: Session = Depends(get_db)
):
    """
    Rank a JD against a list of CVs based on scoring criteria.
    """
    try:
        # Fetch JD details
        jd = db.query(JD).filter(JD.id == payload.jd_id).first()
        if not jd:
            raise HTTPException(status_code=404, detail="JD not found")

        # Fetch CVs from DB
        cvs = db.query(CV).filter(CV.id.in_(payload.cv_ids)).all()
        if not cvs:
            raise HTTPException(status_code=404, detail="No CVs found with the provided IDs")

        # Read JD file from S3
        jd_text = ""
        if jd.path_file.lower().endswith(".pdf"):
            jd_text = read_pdf_from_s3(jd.path_file)
        elif jd.path_file.lower().endswith(".docx"):
            jd_text = read_docx_from_s3(jd.path_file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type for JD")

        # Read the Prompt file
        prompt_text = read_docx(PROMPT_FILE)
        results = []

        # Process each CV
        for cv in cvs:
            # Read CV file from S3
            cv_text = ""
            if cv.path_file.lower().endswith(".pdf"):
                cv_text = read_pdf_from_s3(cv.path_file)
            elif cv.path_file.lower().endswith(".docx"):
                cv_text = read_docx_from_s3(cv.path_file)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file type for CV")

            # Prepare prompt input
            prompt = f"""
            You are tasked with evaluating a Job Description (JD) against a CV based on 4 criteria: 
            Tech Stack, experience, language, and leadership.

            {prompt_text}

            JD: 
            {jd_text}

            CV:
            {cv_text}
            """

            # Call Claude API (Gemini API)
            response = invoke_gemini_api(prompt)
            
            if "error" in response:
                raise HTTPException(status_code=500, detail=response["error"])

            # Build result
            result = {
                "name": cv.name,
                "overall_score": response.get("overall_score", 0),
                "tech_stack": response.get("tech_stack", 0),
                "experience": response.get("experience", 0),
                "language": response.get("language", 0),
                "leadership": response.get("leadership", 0),
            }
            results.append(result)

        # Sort results by overall_score
        results.sort(key=lambda x: x["overall_score"], reverse=True)

        return {"message": "success", "data": results, "count": len(results)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def upload_file_s3(file: UploadFile = File(...), path: str = "cv"):
    # Tạo unique filename
    file_name = f"{uuid.uuid4()}-{file.filename}"
    s3_path = f"{path}/{file_name}"
    
    try:
        # Upload file lên S3
        s3_client.upload_fileobj(file.file, BUCKET_NAME, s3_path)
        # Trả lại path để lưu vào DB
        return {"s3_path": s3_path, "message": "File uploaded successfully"}
    except Exception as e:
        return {"error": str(e)}

# Hàm đọc file trực tiếp từ S3
def read_file_from_s3(path_file: str):
    try:
        response = s3_client.get_object(Bucket=BUCKET_NAME, Key=path_file)
        return response['Body'].read()  # Trả về nội dung file
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error reading file from S3: {e}")

def download_file_from_s3(s3_path):
    # Tạo đường dẫn file tạm
    file_name = os.path.basename(s3_path)
    local_path = f"/tmp/{file_name}"
    
    try:
        # Download file từ S3
        s3_client.download_file(BUCKET_NAME, s3_path, local_path)
        return local_path
    except Exception as e:
        print(f"Error downloading file: {e}")
        return None
    

# Hàm đọc PDF từ S3
def read_pdf_from_s3(path_file: str):
    from PyPDF2 import PdfReader
    file_content = read_file_from_s3(path_file)
    pdf_reader = PdfReader(file_content)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

# Hàm đọc DOCX từ S3
def read_docx_from_s3(path_file: str):
    from io import BytesIO
    from docx import Document
    file_content = read_file_from_s3(path_file)
    doc = Document(BytesIO(file_content))
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text

# Helper function to read docx file
def read_docx(file_path: str) -> str:
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File does not exist: {file_path}")
        content = Document(file_path)
        text = "\n".join([para.text for para in content.paragraphs])
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read docx file: {e}")

# Helper function to read pdf file
def read_pdf(file_path: str) -> str:
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File does not exist: {file_path}")
        reader = PdfReader(file_path)
        text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF file: {e}")

# Run the application (only for testing purposes, not in production)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
