from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class ProjectBase(BaseModel):
    job_id: int = Field(..., description="The ID of the job associated with this project")

class ProjectCreate(ProjectBase):
    pass

class WorkSubmission(BaseModel):
    work_notes: str = Field(..., description="Notes or description of the submitted work", min_length=5)

class ProjectOut(ProjectBase):
    project_id: int = Field(..., description="The unique identifier for the project")
    client_id: int = Field(..., description="The ID of the client for this project")
    freelancer_id: int = Field(..., description="The ID of the freelancer working on this project")
    status: str = Field(..., description="The current status of the project")
    work_notes: Optional[str] = Field(default=None, description="Notes on the submitted work")
    start_date: date = Field(..., description="The date the project started")
    end_date: Optional[date] = Field(default=None, description="The date the project ended")
    created_at: datetime = Field(..., description="Timestamp of when the project was created")

    model_config = ConfigDict(from_attributes=True)
