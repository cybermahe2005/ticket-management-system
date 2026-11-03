from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserListResponse
from app.services.user_service import UserService
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get(
    "",
    response_model=UserListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all registered users (Admin only)",
    description="Returns a paginated list of registered users. Requires ADMIN role. Passwords and sensitive data are excluded."
)
def get_users(
    search: Optional[str] = Query(None, description="Search by name or email"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
) -> UserListResponse:
    return UserService.get_users(
        db=db,
        search=search,
        page=page,
        limit=limit
    )

