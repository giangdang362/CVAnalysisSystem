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

# Load environment variables
load_dotenv()

# Database connection settings
DATABASE_URL = os.getenv("DATABASE_URL")

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

# Run the application (only for testing purposes, not in production)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
