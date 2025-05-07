import { api } from '@/api/api';
import { Warehouse } from '@/types/warehouse.types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const warehouseApi = {
  getAll: () => 
    api.get<Warehouse[]>(`${API_BASE_URL}/warehouses`),
  
  getById: (id: number) => 
    api.get<Warehouse>(`${API_BASE_URL}/warehouses/${id}`),
}; 