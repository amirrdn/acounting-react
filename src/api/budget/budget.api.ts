import { api } from '../api';

export interface Budget {
  id: number;
  name: string;
  year: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  details: BudgetDetail[];
}

export interface BudgetDetail {
  id: number;
  budgetId: number;
  accountId: number;
  januaryAmount: number;
  februaryAmount: number;
  marchAmount: number;
  aprilAmount: number;
  mayAmount: number;
  juneAmount: number;
  julyAmount: number;
  augustAmount: number;
  septemberAmount: number;
  octoberAmount: number;
  novemberAmount: number;
  decemberAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  account: {
    id: number;
    name: string;
    code: string;
  };
}

export interface CreateBudgetData {
  name: string;
  year: number;
  description?: string;
  isActive: boolean;
  details: CreateBudgetDetailData[];
}

export interface CreateBudgetDetailData {
  accountId: number;
  januaryAmount: number;
  februaryAmount: number;
  marchAmount: number;
  aprilAmount: number;
  mayAmount: number;
  juneAmount: number;
  julyAmount: number;
  augustAmount: number;
  septemberAmount: number;
  octoberAmount: number;
  novemberAmount: number;
  decemberAmount: number;
}

export interface BudgetReport extends Budget {
  details: (BudgetDetail & {
    actualAmounts: number[];
  })[];
}

const BUDGET_API_URL = '/budget';

export const budgetApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get(`${BUDGET_API_URL}`);
    return response.data;
  },

  getById: async (id: number): Promise<Budget> => {
    const response = await api.get(`/budget/${id}`);
    return response.data;
  },

  create: async (data: CreateBudgetData): Promise<Budget> => {
    const response = await api.post(`${BUDGET_API_URL}`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateBudgetData>): Promise<Budget> => {
    const response = await api.put(`${BUDGET_API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${BUDGET_API_URL}/${id}`);
  },

  getReport: async (year: number): Promise<BudgetReport[]> => {
    const response = await api.get(`${BUDGET_API_URL}/report/${year}`);
    return response.data;
  },

  createDetail: async (budgetId: number, data: CreateBudgetDetailData): Promise<BudgetDetail> => {
    const response = await api.post(`${BUDGET_API_URL}/${budgetId}/details`, data);
    return response.data;
  },

  deleteDetail: async (budgetId: number, detailId: number): Promise<void> => {
    await api.delete(`${BUDGET_API_URL}/${budgetId}/details/${detailId}`);
  }
}; 