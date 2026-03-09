from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, condecimal

class JobBase(BaseModel):
    title: str
    description: str
    budget: float
    deadline: date

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    status: str

class JobOut(JobBase):
    job_id: int
    client_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
