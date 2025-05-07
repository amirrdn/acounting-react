export interface Stock {
  id: number;
  product: {
    id: number;
    name: string;
    sku: string;
    price: number;
    cost: number;
    is_active: boolean;
    minimumStock: number;
  };
  warehouse: {
    id: number;
    name: string;
  };
  quantity: number;
}

export interface StockTransfer {
  id: number;
  transferDate: string;
  fromWarehouse: Warehouse;
  toWarehouse: Warehouse;
  items: StockTransferItem[];
  status: 'DRAFT' | 'SENT' | 'RECEIVED';
  createdAt: string;
  updatedAt: string;
}

export interface StockTransferItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface StockMutation {
  id: number;
  product: number;
  reference: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockOpname {
  id: number;
  date: string;
  warehouse: Warehouse;
  items: StockOpnameItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StockOpnameItem {
  id: number;
  product: Product;
  actualQty: number;
  systemQty: number;
  diffQty: number;
}

export interface StockAdjustment {
  id: number;
  date: string;
  product: Product;
  warehouse: Warehouse;
  quantity: number;
  type: 'IN' | 'OUT';
  reason: string;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustmentResponse {
  message: string;
  difference?: number;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  cost: number;
  is_active: boolean;
  minimumStock: number;
} 