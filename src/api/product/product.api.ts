import { api } from '../api';

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  unit: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  category?: string;
  isActive: boolean;
}

export interface CreateProductDto {
  code: string;
  name: string;
  description?: string;
  unit: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  category?: string;
  isActive: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

const API_URL = '/products';

export const productService = {
  getAll: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },
  getProducts: async () => {
    const response = await api.get(`/products`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
}; 