from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.ticket import TicketStatus
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketListResponse
)
from app.services.ticket_service import TicketService
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


@router.post(
    "",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new ticket",
    description="Creates a new ticket under the authenticated user's account with default OPEN status."
)
def create_ticket(
    ticket_in: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TicketResponse:
    return TicketService.create_ticket(db=db, user=current_user, data=ticket_in)


@router.get(
    "",
    response_model=TicketListResponse,
    status_code=status.HTTP_200_OK,
    summary="List tickets",
    description="Regular users only see their own tickets. Admins see tickets across all users. Supports status filtering, search, and pagination."
)
def get_tickets(
    status: Optional[TicketStatus] = Query(None, description="Filter by status (OPEN, IN_PROGRESS, CLOSED)"),
    search: Optional[str] = Query(None, description="Search term across title and description"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TicketListResponse:
    return TicketService.get_tickets(
        db=db,
        user=current_user,
        status_filter=status,
        search=search,
        page=page,
        limit=limit
    )


@router.get(
    "/{id}",
    response_model=TicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ticket details by ID",
    description="Fetches full ticket details including creator info. Enforces ownership for regular users; admins can view any ticket."
)
def get_ticket(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TicketResponse:
    return TicketService.get_ticket_by_id(db=db, user=current_user, ticket_id=id)


@router.put(
    "/{id}",
    response_model=TicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a ticket",
    description="Users can edit title/description of their own tickets. Admins can edit title, description, and status of any ticket."
)
def update_ticket(
    id: int,
    ticket_update: TicketUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TicketResponse:
    return TicketService.update_ticket(
        db=db,
        user=current_user,
        ticket_id=id,
        data=ticket_update
    )


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a ticket",
    description="Users can delete their own tickets. Admins can delete any ticket."
)
def delete_ticket(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    return TicketService.delete_ticket(db=db, user=current_user, ticket_id=id)

