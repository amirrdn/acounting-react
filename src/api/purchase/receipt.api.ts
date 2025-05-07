import { api } from '@/api/api';

export const purchaseReceiptService = {
  async create(data: any) {
    const response = await api.post('/purchase/receipts', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/purchase/receipts/${id}`, data);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/purchase/receipts');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/purchase/receipts/${id}`);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/purchase/receipts/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/purchase/receipts/${id}/status`, { status });
    return response.data;
  }
}; 