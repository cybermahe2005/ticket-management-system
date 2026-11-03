export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface TicketCreator {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  user_id: number;
  created_at: string;
  updated_at: string;
  created_by?: TicketCreator | null;
}

export interface TicketCreateRequest {
  title: string;
  description: string;
}

export interface TicketUpdateRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
