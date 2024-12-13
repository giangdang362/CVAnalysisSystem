from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

# Database configuration
DATABASE_URL = "postgresql://aisayhi:aisayhi@localhost/aisayhi"

# Database connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define tables
class CV(Base):
    __tablename__ = 'cv'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    applicant_name = Column(String)
    path_file = Column(String)
    expect_salary = Column(Integer, index=True)
    education = Column(String)
    role = Column(String, index=True)
    recruiter = Column(String)
    experience_summary = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class JD(Base):
    __tablename__ = 'jd'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    path_file = Column(String)
    company_name = Column(String)
    role = Column(String, index=True)
    level = Column(String, index=True)
    languages = Column(String, index=True)
    technical_skill = Column(String, index=True)
    requirement = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

# Create tables in the database
def init_db():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
