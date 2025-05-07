import { Supplier } from './supplier';
import { Product } from './Product';
import { User } from './User';
import { Branch } from './Branch';
import { Account } from './Account';

export interface PurchaseRequestItem {
  id: string;
  product: {
    id: number;
    name: string;
    sku: string;
    price: number;
    cost: number;
    is_active: boolean;
    minimumStock: number;
    productStocks:{
      id: number;
    }
  };
  quantity: number;
  unit: string;
  notes?: string;
  initial_stocks?: { warehouse_id: number; quantity: number }[];
}

export interface PurchaseRequestFormData {
  requestNumber?: string;
  requestDate: string;
  department: string;
  branchId: number;
  warehouseId: number;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
    unit: string;
    notes?: string;
  }[];
}

export interface PurchaseRequestItemData {
  productId: number;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  requestDate: string;
  department: string;
  requestedById: {
    username: string;
    id: string;
    name: string;
  };
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  product: Product[];
  notes?: string;
  items: PurchaseRequestItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  product: Product;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  tax: number;
  subtotal: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  purchaseRequest?: PurchaseRequest;
  supplier: Supplier;
  branch: Branch;
  orderDate: Date;
  expectedDeliveryDate: Date;
  paymentTerms: 'CASH' | 'NET_30' | 'NET_60';
  status: 'DRAFT' | 'APPROVED' | 'SENT' | 'RECEIVED_PARTIAL' | 'RECEIVED_FULL';
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  isPpn: boolean;
  isPph: boolean;
  ppnRate: number;
  pphRate: number;
  notes?: string;
  attachmentUrl?: string;
  approvedBy?: {
    user: User;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GoodsReceiptItem {
  id: string;
  purchaseOrderItem: PurchaseOrderItem;
  receivedQuantity: number;
  notes?: string;
}

export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  purchaseOrder: PurchaseOrder;
  receiptDate: Date;
  items: GoodsReceiptItem[];
  notes?: string;
  receivedBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  purchaseOrder: PurchaseOrder;
  goodsReceipts: GoodsReceipt[];
  invoiceDate: Date;
  dueDate: Date;
  status: 'UNPAID' | 'PAID_PARTIAL' | 'PAID_FULL';
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  remainingAmount: number;
  attachments?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoice: PurchaseInvoice;
  paymentDate: Date;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHECK';
  referenceNumber?: string;
  notes?: string;
  attachments?: string[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseReturnItem {
  id: string;
  goodsReceiptItem: GoodsReceiptItem;
  returnQuantity: number;
  reason: string;
}

export interface PurchaseReturn {
  id: string;
  returnNumber: string;
  purchaseOrder: PurchaseOrder;
  returnDate: Date;
  items: PurchaseReturnItem[];
  totalAmount: number;
  creditNote?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED';
  notes?: string;
  attachments?: string[];
  createdBy: User;
  approvedBy?: {
    user: User;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

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

export interface PurchaseReceipt {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  purchaseOrder: PurchaseOrder;
  items: {
    id: string;
    product: Product;
    quantity: number;
    receivedQuantity: number;
    unit: string;
    unitPrice: number;
    notes: string;
  }[];
  notes: string;
  attachmentUrl?: string;
  status: 'DRAFT' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
} 