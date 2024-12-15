from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import OperationalError
from typing import List
import os
from datetime import datetime
from app.models import CV, JD  # Assuming models are in app.models
from dotenv import load_dotenv
from docx import Document  # To handle docx files
from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT  # For Claude API

# Load environment variables
load_dotenv()

# Database connection settings
DATABASE_URL = os.getenv("DATABASE_URL")
anthropic = Anthropic(api_key=os.getenv("API_KEY"))

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
UPLOAD_FOLDER = "uploaded_files"
PROMPT_FILE = "app/configs/prompt_guide.docx"

# Default route
@app.get("/")
async def root():
    return {"message": "Welcome to CV and JD Analysis System"}

# Health check route for database connection
@app.get("/health/db", tags=["Health Check"])
async def check_database_connection(db: Session = Depends(get_db)):
    """Check if the database connection is working"""
    try:
        # Execute a simple query to test the connection
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Database connection is working"}
    except OperationalError as e:
        return {"status": "error", "message": str(e)}

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
    """Add a new CV"""
    folder_path = os.path.join(UPLOAD_FOLDER, "cv")
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, file.filename)

    try:
        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Add CV record to database
        new_cv = CV(
            name=name,
            applicant_name=applicant_name,
            path_file=file_path,
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
    """Add a new JD"""
    folder_path = os.path.join(UPLOAD_FOLDER, "jd")
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, file.filename)

    try:
        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Add JD record to database
        new_jd = JD(
            name=name,
            path_file=file_path,
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

    return {"message": "success", "data": matching_jds, "count": len(matching_jds)}

@app.post("/matching/jd-to-cvs", tags=["Matching"])
async def match_jd_to_cvs(jd_id: int, db: Session = Depends(get_db)):
    """Match a JD with CVs based on the role"""
    # Fetch the JD by id
    jd = db.query(JD).filter(JD.id == jd_id).first()
    if not jd:
        return {"message": "error", "detail": "JD not found"}

    # Find CVs that match the JD's role
    matching_cvs = db.query(CV).filter(CV.role == jd.role).all()

    return {"message": "success", "data": matching_cvs, "count": len(matching_cvs)}

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


@app.post("/matching/cv-to-jds/rank", tags=["Matching"])
async def rank_cv_against_jds(
    cv_id: int, jd_ids: List[int], db: Session = Depends(get_db)
):
    """
    Rank a CV against a list of JDs based on scoring criteria defined in a prompt file.
    """
    try:
        # Fetch CV and JD details
        cv = db.query(CV).filter(CV.id == cv_id).first()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        jds = db.query(JD).filter(JD.id.in_(jd_ids)).all()
        if not jds:
            raise HTTPException(status_code=404, detail="No JDs found with the provided IDs")

        # Read the Prompt file
        prompt_text = read_docx(PROMPT_FILE)

        # Read CV file
        if not os.path.exists(cv.path_file):
            raise HTTPException(status_code=404, detail=f"CV file not found at: {cv.path_file}")
        cv_text = read_docx(cv.path_file)

        # Prepare JD texts
        jd_inputs = []
        for i, jd in enumerate(jds):
            if not os.path.exists(jd.path_file):
                raise HTTPException(status_code=404, detail=f"JD file not found at: {jd.path_file}")
            jd_text = read_docx(jd.path_file)
            jd_inputs.append(
                f"JD {i+1}:\nCompany: {jd.company_name}, Role: {jd.role}, Level: {jd.level}, Skills: {jd.technical_skill}\n{jd_text}"
            )
        jd_inputs = "\n\n".join(jd_inputs)

        # Prepare input for Claude API
        claude_input = f"""{HUMAN_PROMPT}
        You are tasked with ranking a CV against multiple Job Descriptions (JDs) based on the following criteria:
        - Tech stack
        - Experience
        - Language
        - Leadership

        Here is the input:
        - CV:
        {cv_text}
        - JDs:
        {jd_inputs}
        - Evaluation criteria:
        {prompt_text}

        For each JD, provide the following:
        - Overall_score: Overall match score between the CV and JD.
        - Detail_score: A breakdown of the score into the following:
          - Tech stack
          - Experience
          - Language
          - Leadership
        Provide a JSON-formatted response.
        {AI_PROMPT}"""

        # Call Claude API
        response = anthropic.completions.create(
            model="claude-3.5-sonnet-20240620",
            max_tokens=2000,
            prompt=claude_input
        )

        # Extract Overall_score using Regex
        response_text = response.completion
        overall_scores = re.findall(r"Overall_score: (\d+)", response_text)

        # Parse Response
        results = []
        for i, jd in enumerate(jds):
            result = {
                "jd_name": jd.name,
                "company_name": jd.company_name,
                "role": jd.role,
                "level": jd.level,
                "technical_skill": jd.technical_skill,
                "overall_score": overall_scores[i] if i < len(overall_scores) else "N/A",
                "details": "Parsed detail scores here"
            }
            results.append(result)

        return {"message": "success", "data": results, "count": len(results)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the application (only for testing purposes, not in production)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
