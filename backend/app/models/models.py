from sqlalchemy import Column, Enum, Integer, String, DateTime
from datetime import datetime
from app.db.db_connection import engine, Base, SessionLocal

VALID_ROLES = ["Developer", "UIUX", "BA"]

class CV(Base):
    __tablename__ = "cv"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    applicant_name = Column(String)
    path_file = Column(String)
    expect_salary = Column(Integer, index=True)
    education = Column(String)
    role = Column(Enum(*VALID_ROLES, name="role_type"), nullable=False, index=True)
    recruiter = Column(String)
    experience_summary = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class JD(Base):
    __tablename__ = "jd"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    path_file = Column(String)
    company_name = Column(String)
    role = Column(Enum(*VALID_ROLES, name="role_type"), nullable=False, index=True)
    level = Column(String, index=True)
    languages = Column(String, index=True)
    technical_skill = Column(String, index=True)
    requirement = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
