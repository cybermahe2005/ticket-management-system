from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.auth.password import get_password_hash, verify_password
from app.auth.jwt import create_access_token


class AuthService:
    @staticmethod
    def register_user(db: Session, request: RegisterRequest) -> UserResponse:
        normalized_email = request.email.strip().lower()
        existing_user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists"
            )

        hashed_password = get_password_hash(request.password)

        new_user = User(
            name=request.name.strip(),
            email=normalized_email,
            password_hash=hashed_password,
            role=UserRole.USER  # Strict requirement: Public registration always assigns USER
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return UserResponse.model_validate(new_user)

    @staticmethod
    def authenticate_user(db: Session, request: LoginRequest) -> TokenResponse:
        normalized_email = request.email.strip().lower()
        user = db.query(User).filter(func.lower(User.email) == normalized_email).first()

        if not user or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token_claims = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value
        }
        access_token = create_access_token(data=token_claims)

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

