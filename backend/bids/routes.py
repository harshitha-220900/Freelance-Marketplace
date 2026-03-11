from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from bids import schemas, service
from auth.service import get_current_user
from auth.schemas import UserOut

router = APIRouter()

@router.post(
    "", 
    response_model=schemas.BidOut, 
    status_code=status.HTTP_201_CREATED,
    summary="Submit a Bid",
    description="Submits a new bid for a job. The user must have a 'freelancer' role."
)
async def submit_bid(
    bid: schemas.BidCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if current_user.role != 'freelancer':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only freelancers can submit bids."
        )
    return await service.create_bid(db=db, bid=bid, freelancer_id=current_user.user_id)

@router.get(
    "/job/{job_id}", 
    response_model=List[schemas.BidOut],
    summary="List Job Bids",
    description="Retrieves a list of all bids submitted for a specific job."
)
async def list_bids_for_job(
    job_id: int = Path(..., title="The ID of the job", ge=1),
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return await service.get_bids_for_job(db=db, job_id=job_id)

@router.put(
    "/{bid_id}/accept", 
    response_model=schemas.BidOut,
    summary="Accept a Bid",
    description="Accepts a specific bid for a job. The user must have a 'client' role."
)
async def accept_bid(
    bid_id: int = Path(..., title="The ID of the bid to accept", ge=1),
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if current_user.role != 'client':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only clients can accept bids."
        )
    return await service.accept_bid(db=db, bid_id=bid_id, client_id=current_user.user_id)
