import apiClient from './axios';
import { UserFilterParams, UserListResponse } from '../types/user';

export const userApi = {
  getUsers: async (params?: UserFilterParams): Promise<UserListResponse> => {
    const cleanParams: Record<string, string | number> = {};
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;

    const response = await apiClient.get<UserListResponse>('/users', {
      params: cleanParams,
    });
    return response.data;
  },
};

