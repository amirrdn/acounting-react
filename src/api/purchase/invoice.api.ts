import { api } from '@/api/api';
import { PurchaseInvoice } from './types';

export interface PurchaseInvoiceItem {
  id?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  product?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreatePurchaseInvoiceDto {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  supplierId: string;
  purchaseOrderId?: string;
  purchaseReceiptId?: string;
  branchId: string;
  payableAccountId: string;
  items: PurchaseInvoiceItem[];
  isPpn: boolean;
  isPph: boolean;
  ppnRate?: number;
  pphRate?: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  attachmentUrl?: string;
}

export interface UpdatePurchaseInvoiceDto extends Partial<Omit<CreatePurchaseInvoiceDto, 'items'>> {
  paidAmount?: number;
  status?: PurchaseInvoice['status'];
  remainingAmount?: number;
}

export interface PurchaseInvoiceWithItems extends PurchaseInvoice {
  items: PurchaseInvoiceItem[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/purchase/invoices`;

export const purchaseInvoiceService = {
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreatePurchaseInvoiceDto) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdatePurchaseInvoiceDto) => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
}; 