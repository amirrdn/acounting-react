export interface Sale {
  id: string;
  invoice_number: string;
  date: string;
  customer: {
    id: number;
    name: string;
  };
  total: number;
  items: SaleItem[];
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  notes?: string;
  branch: {
    id: number;
    name: string;
  };
  receivableAccount?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  salesInvoiceId: number;
  quantity: number;
  price: string;
  total: string;
  product: {
    id: number;
    name: string;
    sku: string;
    price: string;
    cost: string;
    is_active: boolean;
    minimumStock: number;
    createdAt: string;
    updatedAt: string;
    defaultSupplier: any;
  };
}

export interface CreateSaleDTO {
  customer: {
    id: number;
    name: string;
  };
  items: Omit<SaleItem, 'id' | 'salesInvoiceId'>[];
  paymentMethod: string;
  notes?: string;
  branch: {
    id: number;
    name: string;
  };
  receivableAccount?: string | null;
  invoice_number?: string;
  date?: string;
}

export interface UpdateSaleDTO {
  customer?: {
    id: number;
    name: string;
  };
  items?: Omit<SaleItem, 'id' | 'salesInvoiceId'>[];
  status?: Sale['status'];
  paymentMethod?: string;
  notes?: string;
  branch?: {
    id: number;
    name: string;
  };
  date?: string;
  invoice_number?: string;
} 