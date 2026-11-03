import { User } from './auth';

export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface UserFilterParams {
  search?: string;
  page?: number;
  limit?: number;
}

