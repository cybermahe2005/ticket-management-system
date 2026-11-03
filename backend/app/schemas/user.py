from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, EmailStr
from app.models.user import UserRole


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserSummaryResponse(UserBase):
    id: int
    role: UserRole

    model_config = ConfigDict(from_attributes=True)


class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserListResponse(BaseModel):
    items: List[UserResponse]
    total: int
    page: int
    limit: int
    total_pages: int

