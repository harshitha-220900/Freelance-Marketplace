from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel

class ProjectBase(BaseModel):
    job_id: int

class ProjectCreate(ProjectBase):
    pass

class WorkSubmission(BaseModel):
    work_notes: str

class ProjectOut(ProjectBase):
    project_id: int
    client_id: int
    freelancer_id: int
    status: str
    work_notes: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True
