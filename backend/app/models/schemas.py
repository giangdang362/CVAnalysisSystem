from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema cho CV
class CvSchema(BaseModel):
    id: Optional[int]
    name: str
    path_file: Optional[str]
    expect_salary: Optional[int]
    education: Optional[str]
    role: str
    recruiter: Optional[str]
    experience_summary: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class CvCreateSchema(BaseModel):
    name: str
    path_file: str
    recruiter: Optional[str]
    role: str
    education: Optional[str]
    expect_salary: Optional[int]
    experience_summary: Optional[str]


# Schema cho JD
class JdSchema(BaseModel):
    id: Optional[int]
    name: str
    company_name: str
    path_file: Optional[str]
    role: str
    level: Optional[str]
    languages: Optional[str]
    technical_skill: Optional[str]
    requirement: Optional[str]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class JdCreateSchema(BaseModel):
    name: str
    company_name: str
    path_file: Optional[str]
    role: str
    level: Optional[str]
    languages: Optional[str]
    technical_skill: Optional[str]
    requirement: Optional[str]
    description: Optional[str]
