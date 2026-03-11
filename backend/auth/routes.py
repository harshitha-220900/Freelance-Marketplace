import logging
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from auth import schemas, service
from database import get_db
from config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(
    "/register",
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Register a new user as 'client' or 'freelancer'. Returns the created user profile.",
)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user with email/password and role selection."""
    logger.info(f"Registration attempt for email={user.email!r} role={user.role!r}")

    # 1. Check for duplicate email
    existing = await service.get_user_by_email(db, email=user.email)
    if existing:
        logger.warning(f"Registration blocked — email already registered: {user.email!r}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please log in or use a different email.",
        )

    # 2. Validate role
    if user.role not in ("client", "freelancer"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'client' or 'freelancer'.",
        )

    # 3. Create user
    try:
        new_user = await service.create_user(db=db, user=user)
        logger.info(f"User created successfully: id={new_user.user_id} email={new_user.email!r}")
        return new_user
    except Exception as exc:
        import traceback
        with open("auth_error.log", "w") as f:
            traceback.print_exc(file=f)
        logger.error(f"Failed to create user {user.email!r}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed due to a server error. Please try again.",
        )


@router.get(
    "/check-email",
    summary="Check if email is available",
    description="Returns whether a given email is already registered.",
)
async def check_email(email: str, db: AsyncSession = Depends(get_db)):
    """Quick email availability check (used for real-time form validation)."""
    existing = await service.get_user_by_email(db, email=email)
    return {"available": existing is None}


@router.post(
    "/login",
    response_model=schemas.Token,
    summary="Login",
    description="Authenticate with email + password and receive a JWT access token.",
)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    logger.info(f"Login attempt for username={form_data.username!r}")
    user = await service.get_user_by_email(db, email=form_data.username)
    if not user or not service.verify_password(form_data.password, user.password_hash):
        logger.warning(f"Failed login for {form_data.username!r}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please try again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = service.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    logger.info(f"Login successful for user id={user.user_id}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.get(
    "/profile",
    response_model=schemas.UserOut,
    summary="Get current user profile",
)
async def read_users_me(current_user: schemas.UserOut = Depends(service.get_current_user)):
    return current_user
