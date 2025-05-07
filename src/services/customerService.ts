import axios from 'axios';
import { Customer } from '../types/Customer';

const API_URL = 'http://localhost:3001/api/customers';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await axios.post(API_URL, customer);
    return response.data;
  },

  update: async (id: number, customer: Partial<Customer>): Promise<Customer> => {
    const response = await axios.put(`${API_URL}/${id}`, customer);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
}; 