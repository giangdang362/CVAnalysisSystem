from pydantic import BaseModel
from typing import List

class CV(BaseModel):
    id: str
    content: str

class RankedCV(BaseModel):
    cv_id: str
    score: float

class RankResponse(BaseModel):
    ranked_cvs: List[RankedCV]
