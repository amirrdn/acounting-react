import { api } from '@/api/api';
import { PurchaseRequest } from '@/types/purchase.types';
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/purchase/request`;

interface ApprovalData {
  approvalNotes: string;
  approvalDate: string;
  budgetCheck: 'OK' | 'NOT_OK';
  stockCheck: 'OK' | 'NOT_OK';
  supplierCheck: 'OK' | 'NOT_OK';
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

interface RejectionData {
  rejectionNotes: string;
  rejectionDate: string;
  rejectionReason: 'BUDGET_EXCEEDED' | 'SUPPLIER_ISSUE' | 'STOCK_AVAILABLE' | 'OTHER';
}

export const purchaseRequestService = {
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: Partial<PurchaseRequest>) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: Partial<PurchaseRequest>) => {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  },

  approve: async (id: string, data: ApprovalData) => {
    const response = await api.post(`${API_URL}/${id}/approve`, data);
    return response.data;
  },

  reject: async (id: string, data: RejectionData) => {
    const response = await api.post(`${API_URL}/${id}/reject`, data);
    return response.data;
  }
}; 