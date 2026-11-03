import enum
from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, native_enum=False, length=50),
        default=UserRole.USER,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    tickets = relationship(
        "Ticket",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

