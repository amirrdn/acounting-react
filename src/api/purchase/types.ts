export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: 'UNPAID' | 'PAID_PARTIAL' | 'PAID_FULL';
  paidAmount: number;
  remainingAmount: number;
  totalAmount: number;
  supplier: {
    id: string;
    name: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
} 