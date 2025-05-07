import { api } from '../api';
import { PurchaseInvoice } from './types';

export interface PurchasePayment {
  id: number;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  notes?: string;
  supplier: {
    id: number;
    name: string;
  };
  purchaseInvoice: PurchaseInvoice;
  paymentAccount: {
    id: number;
    name: string;
  };
}

export interface PurchasePaymentFormData {
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  notes?: string;
  supplierId: number;
  purchaseInvoiceId: number;
  paymentAccountId: number;
}

export interface PurchasePaymentResponse {
  data: PurchasePayment[];
  total: number;
  page: number;
  limit: number;
}

export const getPayments = async () => {
  const response = await api.get<PurchasePaymentResponse>('/purchase/payments');
  return response.data.data;
};

export const getPaymentById = async (id: number) => {
  const response = await api.get<PurchasePayment>(`/purchase/payments/${id}`);
  return response.data;
};

export const createPayment = async (data: PurchasePaymentFormData) => {
  const response = await api.post<PurchasePayment>('/purchase/payments', data);
  return response.data;
};

export const updatePayment = async (id: number, data: PurchasePaymentFormData) => {
  const response = await api.put<PurchasePayment>(`/purchase/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id: number) => {
  try {
    await api.delete(`/purchase/payments/${id}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus pembayaran. Silakan coba lagi nanti.');
  }
};

export const getUnpaidInvoices = async (supplierId: number) => {
  const response = await api.get(`/purchase/payments/unpaid-invoices/${supplierId}`);
  return response.data;
};

export const getInvoiceById = async (id: string | number) => {
  try {
    const response = await api.get(`/purchase/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generatePaymentNumber = async () => {
  const response = await api.get<{ number: string }>('/purchase/payments/generate-number');
  return response.data;
}; 