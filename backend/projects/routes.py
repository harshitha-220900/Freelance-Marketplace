from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from projects import schemas, service
from auth.service import get_current_user
from auth.schemas import UserOut

router = APIRouter()

@router.post("", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED, summary="Create a new project", description="Create a project for an accepted job bid (Clients only).")
async def create_project(
    project: schemas.ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if current_user.role != 'client':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only clients can create projects."
        )
    return await service.create_project(db=db, project=project, client_id=current_user.user_id)

@router.get("", response_model=List[schemas.ProjectOut], summary="List my projects", description="Retrieve all projects associated with the current user.")
async def list_my_projects(
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return await service.get_projects(db=db, user_id=current_user.user_id)

@router.get("/{project_id}", response_model=schemas.ProjectOut, summary="Get project details")
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    project = await service.get_project(db=db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if project.client_id != current_user.user_id and project.freelancer_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized access to this project")
    return project

@router.post("/{project_id}/submit-work", response_model=schemas.ProjectOut, summary="Submit work for a project", description="Submit completed work for a project (Freelancers only).")
async def submit_work(
    project_id: int,
    submission: schemas.WorkSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if current_user.role != 'freelancer':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only freelancers can submit work."
        )
    return await service.submit_work(db=db, project_id=project_id, submission=submission, freelancer_id=current_user.user_id)

@router.put("/{project_id}/approve", response_model=schemas.ProjectOut, summary="Approve submitted work", description="Approve submitted work for a project (Clients only).")
async def approve_work(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if current_user.role != 'client':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only clients can approve work."
        )
    return await service.approve_work(db=db, project_id=project_id, client_id=current_user.user_id)
