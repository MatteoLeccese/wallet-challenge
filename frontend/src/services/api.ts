import api from '../api/axios';
import type { ApiResponse } from '../types/api-response';
import type { LoginData, LoginResponse, RegisterData, RegisterResponse } from '../types/user.interfaces';

export const apiService = {
  // Register client
  register: async (data: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    return await api.post('/auth/register', data);
  },

  // Login client
  login: async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
    return await api.post('/auth/login', data);
  },
};
