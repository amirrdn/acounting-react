export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  unit: string;
  price: number;
  stock: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
} 