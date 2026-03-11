from typing import Sequence
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from reviews.models import Review
from reviews.schemas import ReviewCreate
from projects.service import get_project

async def create_review(db: AsyncSession, review: ReviewCreate, reviewer_id: int) -> Review:
    """Create a new review for a completed or approved project."""
    # Verify project exists and is completed
    project = await get_project(db, review.project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    if project.status not in ['approved', 'completed']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project must be completed or approved to leave a review")
            
    # Verify reviewer is part of project
    if reviewer_id not in [project.client_id, project.freelancer_id]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not part of this project")
        
    # Verify reviewee is part of project and is the other party
    if review.reviewee_id not in [project.client_id, project.freelancer_id] or review.reviewee_id == reviewer_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reviewee for this project")
        
    db_review = Review(
        project_id=project.project_id,
        reviewer_id=reviewer_id,
        reviewee_id=review.reviewee_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    try:
        await db.commit()
        await db.refresh(db_review)
        return db_review
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already reviewed this project")

async def get_user_reviews(db: AsyncSession, user_id: int) -> Sequence[Review]:
    """Retrieve all reviews given to a specific user."""
    query = select(Review).where(Review.reviewee_id == user_id)
    result = await db.execute(query)
    return result.scalars().all()
