from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

class JobBase(BaseModel):
    title: str = Field(..., description="The title of the job", min_length=5, max_length=200)
    description: str = Field(..., description="Detailed description of the job requirements")
    budget: float = Field(..., description="The allocated budget for the job", gt=0)
    deadline: date = Field(..., description="The deadline for job completion")

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    status: str = Field(..., description="The status of the job")

class JobOut(JobBase):
    job_id: int = Field(..., description="The unique identifier for the job")
    client_id: int = Field(..., description="The identifier for the client who posted the job")
    status: str = Field(..., description="The current status of the job")
    created_at: datetime = Field(..., description="Timestamp when the job was created")

    model_config = ConfigDict(from_attributes=True)
