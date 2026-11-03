import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.config import settings
from app.database.connection import engine, SessionLocal
from app.database.base import Base
import app.models  # Ensure all models are registered with Base metadata
from app.models.user import User, UserRole
from app.auth.password import get_password_hash
from app.routers import auth_router, tickets_router, users_router
from sqlalchemy import func


def seed_default_admin() -> None:
    """Automatically seeds the default administrator account on startup."""
    db = SessionLocal()
    try:
        admin_email = "admin@example.com"
        existing = db.query(User).filter(func.lower(User.email) == admin_email).first()
        if not existing:
            default_admin = User(
                name="System Administrator",
                email=admin_email,
                password_hash=get_password_hash("Admin@123"),
                role=UserRole.ADMIN
            )
            db.add(default_admin)
            db.commit()
            print(f"[Auth] Default admin account seeded: {admin_email} (password: Admin@123)")
        elif existing.role != UserRole.ADMIN:
            existing.role = UserRole.ADMIN
            db.commit()
            print(f"[Auth] User '{admin_email}' promoted to ADMIN.")
    except Exception as e:
        db.rollback()
        print(f"[Auth Warning] Could not seed admin account: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database schema auto-creation notice: {e}")

    # Seed default admin user automatically
    seed_default_admin()
    yield


app = FastAPI(
    title="Ticket Management System API",
    description="Production-quality REST API for Ticket Management System with JWT Authentication and Role-Based Access Control.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    openapi_tags=[
        {"name": "Authentication", "description": "Endpoints for registration, login, and user profile verification."},
        {"name": "Tickets", "description": "CRUD operations for support tickets with user and admin access controls."},
        {"name": "Users", "description": "User management endpoints strictly for administrators."},
    ]
)

# CORS Middleware Configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom format for request validation errors."""
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    msg = first_error.get("msg", "Validation error")
    loc = " -> ".join([str(x) for x in first_error.get("loc", []) if x != "body"])
    detail = f"{loc}: {msg}" if loc else msg
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": detail, "errors": errors}
    )


@app.get("/api/health", tags=["Health"], summary="Health check endpoint")
def health_check():
    return {
        "status": "healthy",
        "service": "ticket-management-system",
        "version": "1.0.0"
    }


# Include Routers
app.include_router(auth_router)
app.include_router(tickets_router)
app.include_router(users_router)
