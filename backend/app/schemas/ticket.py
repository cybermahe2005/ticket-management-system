from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.models.ticket import TicketStatus
from app.schemas.user import UserSummaryResponse


class TicketCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, description="Ticket title")
    description: str = Field(..., min_length=5, description="Detailed description of the issue")


class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255, description="Updated ticket title")
    description: Optional[str] = Field(None, min_length=5, description="Updated description")
    status: Optional[TicketStatus] = Field(None, description="Updated ticket status (Admin only)")


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: TicketStatus
    user_id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[UserSummaryResponse] = None

    model_config = ConfigDict(from_attributes=True)


class TicketListResponse(BaseModel):
    items: List[TicketResponse]
    total: int
    page: int
    limit: int
    total_pages: int

