import { api } from '../api';

export interface Branch {
  id: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface CreateBranchDto {
  code: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {}

const API_URL = '/branches';

export const branchService = {
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateBranchDto) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateBranchDto) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
}; 