import { api } from '@/api/api';

export interface Department {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class DepartmentApi {
  async getAll(): Promise<Department[]> {
    const response = await api.get('/departments');
    return response.data;
  }

  async getById(id: number): Promise<Department> {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  }

  async create(data: Partial<Department>): Promise<Department> {
    const response = await api.post('/departments', data);
    return response.data;
  }

  async update(id: number, data: Partial<Department>): Promise<Department> {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/departments/${id}`);
  }
}

export const departmentApi = new DepartmentApi(); 