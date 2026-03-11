from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class BidBase(BaseModel):
    """Base schema with common attributes for a Bid."""
    job_id: int = Field(..., description="The ID of the job this bid is for", gt=0)
    proposal_text: str = Field(..., description="The freelancer's cover letter/proposal text", min_length=10)
    # Aligning with our model update, Decimal is used for financial precision
    bid_amount: Decimal = Field(..., description="The proposed monetary amount for the job", gt=0)

class BidCreate(BidBase):
    """Schema for validating the creation of a new bid."""
    pass

class BidUpdate(BaseModel):
    """Schema for updating an existing bid (e.g. status changes)."""
    status: str = Field(..., description="Current status of the bid (e.g., 'pending', 'accepted', 'rejected')", min_length=1)

class BidOut(BidBase):
    """Schema for returning bid details in API responses."""
    bid_id: int = Field(..., description="The unique identifier for the bid")
    freelancer_id: int = Field(..., description="The ID of the freelancer who submitted the bid", gt=0)
    status: str = Field(..., description="Current status of the bid")
    created_at: datetime = Field(..., description="Timestamp when the bid was created")

    # The modern Pydantic V2 standard for allowing SQLAlchemy ORM model parsing
    model_config = ConfigDict(from_attributes=True)
