from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from config import settings
from auth.models import User
from auth.schemas import UserCreate
from database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a hash for the provided password."""
    # print(f"DEBUG: Hashing password of length {len(password)}")
    if len(password) > 72:
        # Fallback/Safety for bcrypt limits
        password = password[:72]
    return pwd_context.hash(password)

def create_access_token(data: dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Retrieve a user by their email address."""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: UserCreate) -> User:
    """Create a new user and store it in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        bio=user.bio,
        skills=user.skills
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    """Retrieve the currently authenticated user using the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user
