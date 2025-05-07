import { api } from '../api';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  category: string;
  description?: string;
  isActive: boolean;
}

export interface CreateAccountDto {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  category: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}

const API_URL = '/accounts';

export const accountService = {
  getAll: async (params?: { type?: string[] }) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountDto) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccountDto) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
}; 