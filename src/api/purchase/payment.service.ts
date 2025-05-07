import { api } from '@/api/api';
import { PurchaseInvoice } from '@/types/purchase.types';
import { Account } from '@/types/Account';

export interface CreatePurchasePaymentDto {
  paymentNumber: string;
  paymentDate: string;
  purchaseInvoiceId: string;
  amount: number;
  paymentAccountId: number;
  notes?: string;
}

export interface UpdatePurchasePaymentDto extends Partial<CreatePurchasePaymentDto> {}

export interface PurchasePayment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  purchaseInvoice: PurchaseInvoice;
  paymentAccount: Account;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/purchase/payments`;

export const purchasePaymentService = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreatePurchasePaymentDto) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdatePurchasePaymentDto) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  },

  getUnpaidInvoices: async (supplierId: string) => {
    const response = await api.get(`${API_URL}/unpaid-invoices/${supplierId}`);
    return response.data;
  },

  getPaymentAccounts: async () => {
    const response = await api.get('/accounts', {
      params: { type: ['cash', 'bank'] }
    });
    return response.data;
  },

  generatePaymentNumber: async () => {
    const response = await api.get(`${API_URL}/generate-number`);
    return response.data;
  }
}; 