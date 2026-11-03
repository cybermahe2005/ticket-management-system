from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
    description="Registers a new user with standard USER privileges. Duplicate emails are rejected."
)
def register(request: RegisterRequest, db: Session = Depends(get_db)) -> UserResponse:
    return AuthService.register_user(db=db, request=request)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="User login and JWT token generation",
    description="Authenticates credentials and returns a signed JWT access token along with user profile."
)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    return AuthService.authenticate_user(db=db, request=request)


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile",
    description="Returns the profile details of the user associated with the provided JWT Bearer token."
)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)

