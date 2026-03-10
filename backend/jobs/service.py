from typing import Optional
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from jobs.models import Job
from jobs.schemas import JobCreate, JobUpdate

async def create_job(db: AsyncSession, job: JobCreate, client_id: int):
    db_job = Job(
        client_id=client_id,
        title=job.title,
        description=job.description,
        budget=job.budget,
        deadline=job.deadline
    )
    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)
    return db_job

async def get_jobs(db: AsyncSession, status: Optional[str] = None):
    query = select(Job)
    if status:
        query = query.where(Job.status == status)
    result = await db.execute(query)
    return result.scalars().all()

async def get_job(db: AsyncSession, job_id: int):
    result = await db.execute(select(Job).where(Job.job_id == job_id))
    return result.scalars().first()

async def update_job_status(db: AsyncSession, job_id: int, status: str):
    db_job = await get_job(db, job_id)
    if db_job:
        db_job.status = status
        await db.commit()
        await db.refresh(db_job)
    return db_job
