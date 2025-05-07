import { api } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getStockSummary = async () => {
  const response = await api.get(`${API_BASE_URL}/dashboard/stock-summary`);
  return response.data;
};

export const getFinanceSummary = async () => {
  const response = await api.get(`${API_BASE_URL}/dashboard/finance-summary`);
  return response.data;
}; 