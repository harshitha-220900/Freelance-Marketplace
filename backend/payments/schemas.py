from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class TransactionBase(BaseModel):
    project_id: int = Field(..., description="The ID of the project associated with the payment")
    amount: float = Field(..., description="The amount being transacted", gt=0)

class TransactionCreate(TransactionBase):
    pass

class TransactionOut(TransactionBase):
    transaction_id: int = Field(..., description="The unique identity for the transaction")
    client_id: int = Field(..., description="The ID of the client making the payment")
    freelancer_id: int = Field(..., description="The ID of the freelancer receiving the payment")
    status: str = Field(..., description="The current status of the transaction")
    created_at: datetime = Field(..., description="Timestamp of when the transaction occurred")

    model_config = ConfigDict(from_attributes=True)
