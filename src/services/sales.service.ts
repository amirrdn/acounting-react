import { api } from '@/api/api';
import { Sale, CreateSaleDTO, UpdateSaleDTO } from '../types/sales.types';

const API_URL = import.meta.env.VITE_API_URL;

export const SalesService = {
  getAllSales: async (): Promise<Sale[]> => {
    const response = await api.get(`${API_URL}/sales-invoices`);
    return response.data;
  },

  getSaleById: async (id: string): Promise<Sale> => {
    const response = await api.get(`${API_URL}/sales-invoices/${id}`);
    return response.data;
  },

  createSale: async (saleData: CreateSaleDTO): Promise<Sale> => {
    const response = await api.post(`${API_URL}/sales-invoices`, saleData);
    return response.data;
  },

  updateSale: async (id: string, saleData: UpdateSaleDTO): Promise<Sale> => {
    const response = await api.put(`${API_URL}/sales-invoices/${id}`, saleData);
    return response.data;
  },

  deleteSale: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/sales-invoices/${id}`);
  }
}; 