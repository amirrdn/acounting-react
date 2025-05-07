import { api } from '../api';

export interface Supplier {
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
}

export interface CreateSupplierDto {
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {}

const API_URL = '/suppliers';

export const supplierService = {
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateSupplierDto) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateSupplierDto) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
}; 