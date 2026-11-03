import math
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserResponse, UserListResponse


class UserService:
    @staticmethod
    def get_users(
        db: Session,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> UserListResponse:
        page = max(1, page)
        limit = max(1, min(100, limit))

        query = db.query(User)

        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    User.name.ilike(term),
                    User.email.ilike(term)
                )
            )

        total = query.count()
        total_pages = math.ceil(total / limit) if total > 0 else 1

        users = (
            query.order_by(User.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return UserListResponse(
            items=[UserResponse.model_validate(u) for u in users],
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages
        )

