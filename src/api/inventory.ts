import { api } from './api';
import {
  Stock,
  StockTransfer,
  StockMutation,
  StockOpname,
  StockAdjustment
} from '../types/inventory';

interface StockAdjustmentResponse {
  message: string;
  difference?: number;
}

interface StockAdjustmentRequest {
  productId: number;
  actualQty: number;
  reason: string;
  userId: number;
}

interface StockOpnameRequest {
  warehouseId: number;
  items: {
    productId: number;
    actualQty: number;
  }[];
}

export const inventoryService = {
  getStocks: async (): Promise<Stock[]> => {
    const response = await api.get('/inventory/stocks');
    return response.data;
  },

  getStockById: async (id: number): Promise<Stock> => {
    const response = await api.get(`/inventory/stocks/${id}`);
    return response.data;
  },

  createStockTransfer: async (data: {
    fromWarehouseId: number;
    toWarehouseId: number;
    transferDate: string;
    items: { productId: number; quantity: number }[];
  }): Promise<StockTransfer> => {
    const response = await api.post('/stock-transfer', data);
    return response.data;
  },

  getStockTransfers: async (): Promise<StockTransfer[]> => {
    const response = await api.get('/stock-transfer');
    return response.data;
  },

  getStockMutations: async (): Promise<StockMutation[]> => {
    const response = await api.get('/inventory/mutations');
    return response.data;
  },

  createStockOpname: async (data: StockOpnameRequest): Promise<StockOpname> => {
    const response = await api.post('/stock-opname', data);
    return response.data;
  },

  getStockOpnames: async (): Promise<StockOpname[]> => {
    const response = await api.get('/stock-opname');
    return response.data.map((item: any) => ({
      id: item.id,
      date: item.date,
      warehouse: item.warehouse,
      items: item.items,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  },

  createStockAdjustment: async (data: StockAdjustmentRequest): Promise<StockAdjustmentResponse> => {
    const response = await api.post('/stock-adjustment', data);
    return response.data;
  },

  getStockAdjustments: async (): Promise<StockAdjustment[]> => {
    const response = await api.get('/stock-adjustment');
    return response.data.map((item: any) => ({
      id: item.id,
      date: item.createdAt,
      product: item.product,
      warehouse: item.warehouse || null,
      quantity: item.quantity || 0,
      type: item.type || 'ADJUSTMENT',
      reason: item.reason,
      status: item.status || 'DRAFT',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  },

  approveStockTransfer: async (id: number) => {
    const response = await api.post(`/inventory/transfers/${id}/approve`);
    return response.data;
  },

  approveStockOpname: async (id: number) => {
    const response = await api.post(`/inventory/opnames/${id}/approve`);
    return response.data;
  },

  approveStockAdjustment: async (id: number) => {
    const response = await api.post(`/stock-adjustment/${id}/approve`);
    return response.data;
  },

  getStockCard: async (productId: number): Promise<StockMutation[]> => {
    const response = await api.get(`/stock/stock-card/${productId}`);
    return response.data;
  }
}; 