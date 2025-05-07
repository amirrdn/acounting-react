import api from './axios';
import { PurchaseRequest, PurchaseRequestFormData } from '../types/purchase.types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const purchaseRequestApi = {
  getAll: () => 
    api.get<PurchaseRequest[]>(`${API_BASE_URL}/purchase/request`),
  
  getById: (id: string) => 
    api.get<PurchaseRequest>(`${API_BASE_URL}/purchase/request/${id}`),
  
  create: (data: PurchaseRequestFormData) => 
    api.post<PurchaseRequest>(`${API_BASE_URL}/purchase/request`, data),
  
  update: (id: string, data: PurchaseRequestFormData) => 
    api.put<PurchaseRequest>(`${API_BASE_URL}/purchase/request/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`${API_BASE_URL}/purchase/request/${id}`)
}; 