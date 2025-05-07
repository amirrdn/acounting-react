interface Account {
  id: number;
  name: string;
  code: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface ProductStock {
  id: number;
  quantity: number;
  warehouse: Warehouse;
}

interface StockMutation {
  id: number;
  reference: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  unit: string;
  stock: number;
  price: number;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  sku: string;
  cost: number;
  is_active: boolean;
  inventory_account?: Account;
  sales_account?: Account;
  purchase_account?: Account;
  minimumStock: number;
  defaultSupplier?: Supplier;
  stockMutations?: StockMutation[];
  productStocks?: ProductStock[];
}

export interface ProductFormData {
  name: string;
  sku: string;
  price: number;
  cost: number;
  minimumStock: number;
  is_active: boolean;
  initial_stocks?: { warehouse_id: number; quantity: number }[];
}
