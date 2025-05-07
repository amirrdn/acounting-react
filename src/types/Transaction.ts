import { TransactionStatus } from '../constants/status';

export interface Transaction {
  id: number;
  transaction_number: string;
  date: string;
  status: TransactionStatus;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesInvoice extends Transaction {
  customer: {
    id: number;
    name: string;
  };
  items: SalesInvoiceItem[];
}

export interface SalesInvoiceItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface PurchaseInvoice extends Transaction {
  supplier: {
    id: number;
    name: string;
  };
  items: PurchaseInvoiceItem[];
}

export interface PurchaseInvoiceItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
} 