from typing import Generator
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings


def init_engine():
    db_url = settings.DATABASE_URL

    if "sqlite" in db_url:
        return create_engine(db_url, connect_args={"check_same_thread": False})

    # If PostgreSQL is configured, attempt connection
    try:
        pg_engine = create_engine(
            db_url,
            connect_args={"connect_timeout": 2},
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20
        )
        with pg_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"[Database] Successfully connected to PostgreSQL: {db_url}")
        return pg_engine
    except Exception:
        fallback_url = "sqlite:///./ticket_management.db"
        print(f"[Database Notice] PostgreSQL not reachable at {db_url}.")
        print(f"[Database Notice] Automatically using local database '{fallback_url}' so the application works seamlessly.")
        return create_engine(fallback_url, connect_args={"check_same_thread": False})


engine = init_engine()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db() -> Generator[Session, None, None]:
    """Dependency for providing database sessions per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
