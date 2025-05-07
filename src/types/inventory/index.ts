export interface Stock {
  id: number;
  product: Product;
  warehouse: Warehouse;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  sku: string;
  price: number;
  cost: number;
  is_active: boolean;
  minimumStock: number;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
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
  product: Product;
  warehouse: Warehouse;
  quantity: number;
  type: 'IN' | 'OUT';
  reference: string;
  createdAt: string;
}

export interface StockOpname {
  id: number;
  date: string;
  warehouse: Warehouse;
  items: StockOpnameItem[];
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
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
  warehouse: Warehouse;
  items: StockAdjustmentItem[];
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface StockAdjustmentItem {
  id: number;
  product: Product;
  quantity: number;
  type: 'IN' | 'OUT';
  reason: string;
} 