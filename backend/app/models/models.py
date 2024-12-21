from sqlalchemy import Column, Enum, Integer, String, DateTime
from datetime import datetime
from app.db.db_connection import Base

# Hằng số dùng chung
VALID_ROLES = ["Developer", "UIUX", "BA", "TEST"]

class CV(Base):
    """
    Model for storing CV information.
    """
    __tablename__ = "cv"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    path_file = Column(String, nullable=True)  # Path to the CV file on S3
    expect_salary = Column(Integer, index=True, nullable=True)
    education = Column(String, nullable=True)
    role = Column(Enum(*VALID_ROLES, name="role_type"), nullable=False, index=True)  # Valid roles from VALID_ROLES
    recruiter = Column(String, nullable=True)
    experience_summary = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class JD(Base):
    """
    Model for storing Job Description (JD) information.
    """
    __tablename__ = "jd"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    path_file = Column(String, nullable=True)  # Path to the JD file on S3
    company_name = Column(String, nullable=False)
    role = Column(Enum(*VALID_ROLES, name="role_type"), nullable=False, index=True)  # Valid roles from VALID_ROLES
    level = Column(String, index=True, nullable=True)
    languages = Column(String, index=True, nullable=True)  # Programming languages
    technical_skill = Column(String, index=True, nullable=True)  # Technical skills required
    requirement = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
