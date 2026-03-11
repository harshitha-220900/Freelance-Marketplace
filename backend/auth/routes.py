from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from auth import schemas, service
from database import get_db
from config import settings

router = APIRouter()

@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED, summary="Register a new user", description="Register a new user account as either a 'client' or 'freelancer'.")
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    if user.role not in ['client', 'freelancer']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Role must be either 'client' or 'freelancer'"
        )
        
    return await service.create_user(db=db, user=user)

@router.post("/login", response_model=schemas.Token, summary="Login", description="Authenticate a user and return a JWT access token.")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await service.get_user_by_email(db, email=form_data.username)
    if not user or not service.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = service.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=schemas.UserOut, summary="Get current user profile", description="Retrieve the profile information of the currently authenticated user.")
async def read_users_me(current_user: schemas.UserOut = Depends(service.get_current_user)):
    return current_user
