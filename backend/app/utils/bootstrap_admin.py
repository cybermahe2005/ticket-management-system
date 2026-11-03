import argparse
import sys
from sqlalchemy import func
from app.database.connection import SessionLocal, engine
from app.database.base import Base
from app.models.user import User, UserRole
from app.auth.password import get_password_hash


def bootstrap_admin(name: str, email: str, password: str) -> None:
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    normalized_email = email.strip().lower()

    db = SessionLocal()
    try:
        user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
        if user:
            print(f"User with email '{normalized_email}' already exists. Elevating to ADMIN role...")
            user.role = UserRole.ADMIN
            user.name = name.strip()
            user.password_hash = get_password_hash(password)
            db.commit()
            print(f"User '{normalized_email}' has been successfully updated to ADMIN.")
        else:
            admin_user = User(
                name=name.strip(),
                email=normalized_email,
                password_hash=get_password_hash(password),
                role=UserRole.ADMIN
            )
            db.add(admin_user)
            db.commit()
            print(f"Admin user '{normalized_email}' successfully created with ID {admin_user.id}.")
    except Exception as e:
        db.rollback()
        print(f"Error bootstrapping admin: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Bootstrap or create an administrator account securely.")
    parser.add_argument("--name", default="System Administrator", help="Admin user's full name")
    parser.add_argument("--email", default="admin@example.com", help="Admin user's email address")
    parser.add_argument("--password", default="Admin@123", help="Admin user's password")
    args = parser.parse_args()

    bootstrap_admin(name=args.name, email=args.email, password=args.password)


if __name__ == "__main__":
    main()

