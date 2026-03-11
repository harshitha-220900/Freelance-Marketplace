from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class BidBase(BaseModel):
    job_id: int = Field(..., description="The ID of the job being bid on")
    proposal_text: str = Field(..., description="The freelancer's proposal", min_length=10)
    bid_amount: float = Field(..., description="The proposed amount for the job", gt=0)

class BidCreate(BidBase):
    pass

class BidUpdate(BaseModel):
    status: str = Field(..., description="The updated status of the bid")

class BidOut(BidBase):
    bid_id: int = Field(..., description="The unique identifier for the bid")
    freelancer_id: int = Field(..., description="The ID of the freelancer who made the bid")
    status: str = Field(..., description="The current status of the bid")
    created_at: datetime = Field(..., description="Timestamp of when the bid was created")

    model_config = ConfigDict(from_attributes=True)
