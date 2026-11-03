import apiClient from './axios';
import {
  Ticket,
  TicketCreateRequest,
  TicketListResponse,
  TicketStatus,
  TicketUpdateRequest,
} from '../types/ticket';

export interface TicketFilterParams {
  status?: TicketStatus | '';
  search?: string;
  page?: number;
  limit?: number;
}

export const ticketApi = {
  getTickets: async (params?: TicketFilterParams): Promise<TicketListResponse> => {
    const cleanParams: Record<string, string | number> = {};
    if (params?.status) cleanParams.status = params.status;
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;

    const response = await apiClient.get<TicketListResponse>('/tickets', {
      params: cleanParams,
    });
    return response.data;
  },

  getTicketById: async (id: number): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (data: TicketCreateRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },

  updateTicket: async (id: number, data: TicketUpdateRequest): Promise<Ticket> => {
    const response = await apiClient.put<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  deleteTicket: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/tickets/${id}`);
    return response.data;
  },
};

