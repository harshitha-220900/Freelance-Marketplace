from typing import List, Optional
from datetime import datetime
from sqlalchemy.future import select
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from projects.models import Project
from projects.schemas import ProjectCreate, WorkSubmission
from bids.service import get_bids_for_job
from jobs.service import get_job

async def create_project(db: AsyncSession, project: ProjectCreate, client_id: int):
    # Verify the job exists and belongs to the client
    job = await get_job(db, project.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != client_id:
        raise HTTPException(status_code=403, detail="Only the job owner can create a project")
        
    # Find the accepted bid for this job to get the freelancer_id
    bids = await get_bids_for_job(db, project.job_id)
    accepted_bid = next((b for b in bids if b.status == 'accepted'), None)
    
    if not accepted_bid:
        raise HTTPException(status_code=400, detail="No accepted bid found for this job")
        
    # Ensure project doesn't already exist for this job
    existing_project = await db.execute(select(Project).where(Project.job_id == project.job_id))
    if existing_project.scalars().first():
        raise HTTPException(status_code=400, detail="A project already exists for this job")
        
    db_project = Project(
        job_id=job.job_id,
        client_id=client_id,
        freelancer_id=accepted_bid.freelancer_id,
        status='active'
    )
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project

async def get_projects(db: AsyncSession, user_id: int):
    query = select(Project).where(or_(Project.client_id == user_id, Project.freelancer_id == user_id))
    result = await db.execute(query)
    return result.scalars().all()

async def get_project(db: AsyncSession, project_id: int):
    result = await db.execute(select(Project).where(Project.project_id == project_id))
    return result.scalars().first()

async def submit_work(db: AsyncSession, project_id: int, submission: WorkSubmission, freelancer_id: int):
    project = await get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.freelancer_id != freelancer_id:
        raise HTTPException(status_code=403, detail="Only the assigned freelancer can submit work")
    if project.status != 'active':
        raise HTTPException(status_code=400, detail="Project is not in active state")
        
    project.status = 'work_submitted'
    project.work_notes = submission.work_notes
    await db.commit()
    await db.refresh(project)
    return project

async def approve_work(db: AsyncSession, project_id: int, client_id: int):
    project = await get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.client_id != client_id:
        raise HTTPException(status_code=403, detail="Only the client can approve work")
    if project.status != 'work_submitted':
        raise HTTPException(status_code=400, detail="No work submitted to approve")
        
    project.status = 'approved'
    project.end_date = datetime.utcnow().date()
    
    # Also update the job status to completed
    job = await get_job(db, project.job_id)
    if job:
        job.status = 'completed'
        
    await db.commit()
    await db.refresh(project)
    return project
