from typing import List, Optional
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from bids.models import Bid
from bids.schemas import BidCreate
from jobs.service import get_job

async def create_bid(db: AsyncSession, bid: BidCreate, freelancer_id: int):
    # Verify job exists and is open
    job = await get_job(db, bid.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != 'open':
        raise HTTPException(status_code=400, detail="Job is not open for bidding")
        
    db_bid = Bid(
        job_id=bid.job_id,
        freelancer_id=freelancer_id,
        proposal_text=bid.proposal_text,
        bid_amount=bid.bid_amount
    )
    db.add(db_bid)
    
    try:
        await db.commit()
        await db.refresh(db_bid)
        return db_bid
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="You have already bid on this job")

async def get_bids_for_job(db: AsyncSession, job_id: int):
    result = await db.execute(select(Bid).where(Bid.job_id == job_id))
    return result.scalars().all()

async def get_bid(db: AsyncSession, bid_id: int):
    result = await db.execute(select(Bid).where(Bid.bid_id == bid_id))
    return result.scalars().first()

async def accept_bid(db: AsyncSession, bid_id: int, client_id: int):
    # Get the bid and its associated job
    bid = await get_bid(db, bid_id)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
        
    job = await get_job(db, bid.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job.client_id != client_id:
        raise HTTPException(status_code=403, detail="You are not authorized to accept bids for this job")
        
    if job.status != 'open':
        raise HTTPException(status_code=400, detail="Job no longer open")
        
    # Accept this bid, reject others
    bids = await get_bids_for_job(db, job.job_id)
    for b in bids:
        b.status = 'accepted' if b.bid_id == bid_id else 'rejected'
        
    job.status = 'in_progress'
    
    await db.commit()
    await db.refresh(bid)
    return bid
