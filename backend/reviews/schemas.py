from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class ReviewBase(BaseModel):
    project_id: int = Field(..., description="The ID of the project the review is associated with")
    reviewee_id: int = Field(..., description="The ID of the user being reviewed")
    rating: int = Field(..., description="Rating given, from 1 to 5", ge=1, le=5)
    comment: Optional[str] = Field(default=None, description="Optional text comment for the review")

class ReviewCreate(ReviewBase):
    pass

class ReviewOut(ReviewBase):
    review_id: int = Field(..., description="The unique identifier for the review")
    reviewer_id: int = Field(..., description="The ID of the user giving the review")
    created_at: datetime = Field(..., description="Timestamp of when the review was created")

    model_config = ConfigDict(from_attributes=True)
