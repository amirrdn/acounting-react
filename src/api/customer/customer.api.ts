import { api } from '../api';

export interface Customer {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  isActive: boolean;
}

export interface CreateCustomerDto {
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  isActive: boolean;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

const API_URL = '/customers';

export const customerService = {
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomerDto) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomerDto) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
}; 