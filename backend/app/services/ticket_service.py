from datetime import datetime, timezone
import math
from typing import Optional
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.user import User, UserRole
from app.models.ticket import Ticket, TicketStatus
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketListResponse
)
from app.schemas.user import UserSummaryResponse


class TicketService:
    @staticmethod
    def create_ticket(db: Session, user: User, data: TicketCreate) -> TicketResponse:
        new_ticket = Ticket(
            title=data.title.strip(),
            description=data.description.strip(),
            status=TicketStatus.OPEN,
            user_id=user.id
        )
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)

        return TicketResponse(
            id=new_ticket.id,
            title=new_ticket.title,
            description=new_ticket.description,
            status=new_ticket.status,
            user_id=new_ticket.user_id,
            created_at=new_ticket.created_at,
            updated_at=new_ticket.updated_at,
            created_by=UserSummaryResponse.model_validate(user)
        )

    @staticmethod
    def get_tickets(
        db: Session,
        user: User,
        status_filter: Optional[TicketStatus] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> TicketListResponse:
        page = max(1, page)
        limit = max(1, min(100, limit))

        query = db.query(Ticket).options(joinedload(Ticket.user))

        # USER can only see their own tickets; ADMIN can see all tickets
        if user.role != UserRole.ADMIN:
            query = query.filter(Ticket.user_id == user.id)

        # Status filter
        if status_filter:
            query = query.filter(Ticket.status == status_filter)

        # Search filter
        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Ticket.title.ilike(term),
                    Ticket.description.ilike(term)
                )
            )

        total = query.count()
        total_pages = math.ceil(total / limit) if total > 0 else 1

        tickets = (
            query.order_by(Ticket.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        items = [
            TicketResponse(
                id=t.id,
                title=t.title,
                description=t.description,
                status=t.status,
                user_id=t.user_id,
                created_at=t.created_at,
                updated_at=t.updated_at,
                created_by=UserSummaryResponse.model_validate(t.user) if t.user else None
            )
            for t in tickets
        ]

        return TicketListResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages
        )

    @staticmethod
    def get_ticket_by_id(db: Session, user: User, ticket_id: int) -> TicketResponse:
        ticket = (
            db.query(Ticket)
            .options(joinedload(Ticket.user))
            .filter(Ticket.id == ticket_id)
            .first()
        )

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ticket with ID {ticket_id} was not found"
            )

        # Ownership validation
        if user.role != UserRole.ADMIN and ticket.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this ticket"
            )

        return TicketResponse(
            id=ticket.id,
            title=ticket.title,
            description=ticket.description,
            status=ticket.status,
            user_id=ticket.user_id,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
            created_by=UserSummaryResponse.model_validate(ticket.user) if ticket.user else None
        )

    @staticmethod
    def update_ticket(
        db: Session,
        user: User,
        ticket_id: int,
        data: TicketUpdate
    ) -> TicketResponse:
        ticket = (
            db.query(Ticket)
            .options(joinedload(Ticket.user))
            .filter(Ticket.id == ticket_id)
            .first()
        )

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ticket with ID {ticket_id} was not found"
            )

        # Ownership validation for USER
        if user.role != UserRole.ADMIN:
            if ticket.user_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to modify this ticket"
                )
            if data.status is not None and data.status != ticket.status:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Regular users are not authorized to change ticket status"
                )
            if data.title is not None:
                ticket.title = data.title.strip()
            if data.description is not None:
                ticket.description = data.description.strip()
        else:
            # ADMIN can update title, description, and status
            if data.title is not None:
                ticket.title = data.title.strip()
            if data.description is not None:
                ticket.description = data.description.strip()
            if data.status is not None:
                ticket.status = data.status

        ticket.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(ticket)

        return TicketResponse(
            id=ticket.id,
            title=ticket.title,
            description=ticket.description,
            status=ticket.status,
            user_id=ticket.user_id,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
            created_by=UserSummaryResponse.model_validate(ticket.user) if ticket.user else None
        )

    @staticmethod
    def delete_ticket(db: Session, user: User, ticket_id: int) -> dict:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ticket with ID {ticket_id} was not found"
            )

        # Ownership validation
        if user.role != UserRole.ADMIN and ticket.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this ticket"
            )

        db.delete(ticket)
        db.commit()

        return {"message": f"Ticket #{ticket_id} successfully deleted"}

