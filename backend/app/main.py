from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from typing import List
import os
from datetime import datetime
from app.models import CV, JD  # Assuming models are in app.models
from dotenv import load_dotenv
from docx import Document  # To handle docx files
from anthropic import HUMAN_PROMPT, AI_PROMPT  # For Claude API
from app.invoke_promt import call_claude_api
import re
from fastapi.staticfiles import StaticFiles
from PyPDF2 import PdfReader

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
PROMPT_FILE_OLD = "app/configs/prompt_guide.docx"
PROMPT_FILE= "app/configs/prompt.docx"

# Mount thư mục uploaded_files để truy cập
app.mount("/uploaded_files", StaticFiles(directory="uploaded_files"), name="uploaded_files")

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

@app.post("/matching/cv-to-jds/rank", tags=["Matching"])
async def rank_cv_against_jds(cv_id: int, jd_ids: List[int], db: Session = Depends(get_db)):
    try:
        cv = db.query(CV).filter(CV.id == cv_id).first()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        jds = db.query(JD).filter(JD.id.in_(jd_ids)).all()
        if not jds:
            raise HTTPException(status_code=404, detail="No JDs found")

        # Read CV content
        if cv.path_file.lower().endswith(".pdf"):
            cv_text = read_pdf(cv.path_file)
        elif cv.path_file.lower().endswith(".docx"):
            cv_text = read_docx(cv.path_file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported CV file format")

        results = []

        for jd in jds:
            if jd.path_file.lower().endswith(".pdf"):
                jd_text = read_pdf(jd.path_file)
            elif jd.path_file.lower().endswith(".docx"):
                jd_text = read_docx(jd.path_file)
            else:
                raise HTTPException(status_code=400, detail="Unsupported JD file format")

            # Prepare the prompt
            prompt = f"""
            You are tasked with evaluating a CV against a Job Description (JD) based on the following criteria: Tech Stack, Experience, Language, and Leadership.

            JD:
            {jd_text}

            CV:
            {cv_text}

            Follow the scoring rubric and return JSON in the specified format.
            """

            # Call Claude API
            response = call_claude_api(prompt)
            
            if "error" in response:
                raise HTTPException(status_code=500, detail=response["error"])

            # Build result
            result = {
                "jd_name": jd.name,
                "overall_score": response.get("Overall_Score", 0),
                "score_detail": {
                    "tech_stack": response.get("Tech_Stack", 0),
                    "experience": response.get("Experience", 0),
                    "language": response.get("Language", 0),
                    "leadership": response.get("Leadership", 0),
                }
            }
            results.append(result)

        results.sort(key=lambda x: x["overall_score"], reverse=True)
        return {"message": "success", "data": results, "count": len(results)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/matching/jd-to-cvs/rank", tags=["Matching"])
async def rank_jd_against_cvs(
    jd_id: int, cv_ids: List[int], db: Session = Depends(get_db)
):
    """
    Rank a JD against a list of CVs based on scoring criteria defined in a prompt file.
    """
    try:
        # Fetch JD details
        jd = db.query(JD).filter(JD.id == jd_id).first()
        if not jd:
            raise HTTPException(status_code=404, detail="JD not found")

        cvs = db.query(CV).filter(CV.id.in_(cv_ids)).all()
        if not cvs:
            raise HTTPException(status_code=404, detail="No CVs found with the provided IDs")

        # Read the Prompt file
        prompt_text = read_docx(PROMPT_FILE)

        # Read JD file
        if not os.path.exists(jd.path_file):
            raise HTTPException(status_code=404, detail=f"JD file not found at: {jd.path_file}")
        
        # Determine file type and read content for JD
        if jd.path_file.lower().endswith(".pdf"):
            jd_text = read_pdf(jd.path_file)
        elif jd.path_file.lower().endswith(".docx"):
            jd_text = read_docx(jd.path_file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type for JD")

        results = []

        # Process each CV individually
        for cv in cvs:
            if not os.path.exists(cv.path_file):
                raise HTTPException(status_code=404, detail=f"CV file not found at: {cv.path_file}")

            # Determine file type and read content for CV
            if cv.path_file.lower().endswith(".pdf"):
                cv_text = read_pdf(cv.path_file)
            elif cv.path_file.lower().endswith(".docx"):
                cv_text = read_docx(cv.path_file)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file type for CV")

            # Prepare input for Claude API
            prompt_input = f"""{HUMAN_PROMPT}
            You are tasked with ranking a Job Description (JD) against a CV based on the following criteria:
            - Tech stack
            - Experience
            - Language
            - Leadership

            Here is the input:
            - JD:
            Company: {jd.company_name}, Role: {jd.role}, Level: {jd.level}, Skills: {jd.technical_skill}
            {jd_text}
            - CV:
            {cv_text}
            - Evaluation criteria:
            {prompt_text}

            Provide the following:
            - Overall_score: Overall match score between the JD and CV.
            Provide a JSON-formatted response.
            {AI_PROMPT}"""

            # Call Claude API
            response = call_claude_api(prompt_input)

            # Ensure response is string and handle JSON content
            if isinstance(response, dict):
                # Extract 'content' or the key containing the result text
                response_text = response.get("content", "")
            elif isinstance(response, str):
                response_text = response
            else:
                raise HTTPException(status_code=500, detail="Invalid response format from Claude API")

            # Use Regex to extract Overall_score
            overall_score_match = re.search(r"Overall_score: (\d+)", response_text)
            overall_score = int(overall_score_match.group(1)) if overall_score_match else 0

            result = {
                "cv_name": cv.name,
                "applicant_name": cv.applicant_name,
                "role": cv.role,
                "expect_salary": cv.expect_salary,
                "education": cv.education,
                "overall_score": overall_score
            }
            results.append(result)

        # Sort results by overall_score in descending order
        results.sort(key=lambda x: x["overall_score"], reverse=True)

        return {"message": "success", "data": results, "count": len(results)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
