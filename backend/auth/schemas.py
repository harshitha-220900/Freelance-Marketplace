from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserBase(BaseModel):
    name: str = Field(..., description="The user's full name", min_length=2)
    email: EmailStr = Field(..., description="The user's email address")
    role: str = Field(..., description="User role, e.g. 'client' or 'freelancer'")
    bio: Optional[str] = Field(default=None, description="Optional biography of the user")
    skills: Optional[str] = Field(default=None, description="Optional skills list, usually for freelancers")

class UserCreate(UserBase):
    password: str = Field(..., description="The raw password for the user", min_length=6)

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="The user's registered email address")
    password: str = Field(..., description="The user's password")

class UserOut(UserBase):
    user_id: int = Field(..., description="The unique identity for the user")
    created_at: datetime = Field(..., description="Timestamp of when the user was created")

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str = Field(..., description="The JWT access token string")
    token_type: str = Field(..., description="The type of token, typically 'bearer'")
