import { api } from '@/api/api';

export const purchaseOrderService = {
  async create(data: FormData) {
    const response = await api.post('/purchase/orders', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, data: FormData) {
    const response = await api.put(`/purchase/orders/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAll() {
    const response = await api.get('/purchase/orders');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.error('Invalid response format:', response.data);
    throw new Error('Format data purchase order tidak valid');
  },

  async getById(id: string) {
    const response = await api.get(`/purchase/orders/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string, approvalNotes?: string) {
    try {
      const response = await api.patch(`/purchase/orders/${id}/status`, { status, approvalNotes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string) {
    const response = await api.delete(`/purchase/orders/${id}`);
    return response.data;
  },

  async approve(id: string) {
    const response = await api.post(`/purchase/orders/${id}/approve`);
    return response.data;
  },

  async send(id: string) {
    const response = await api.post(`/purchase/orders/${id}/send`);
    return response.data;
  }
}; 