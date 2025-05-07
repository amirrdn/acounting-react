import { api } from '../api';

export type CashInRequest = {
  accountId: number;
  destinationAccountId: number;
  amount: number;
  description: string;
  branchId: number;
  date?: Date;
};

export interface CashOutRequest {
  accountId: number;
  amount: number;
  description: string;
  branchId: number;
  destinationAccountId: number;
  date?: Date;
}

export interface TransferRequest {
  sourceId: number;
  destinationAccountId: number;
  amount: number;
  description: string;
  branchId: number;
  date?: Date;
}

export const cashBankService = {
  cashIn: async (data: CashInRequest) => {
    const response = await api.post('/cashbank/in', data);
    return response.data;
  },

  cashOut: async (data: CashOutRequest) => {
    const response = await api.post('/cashbank/out', data);
    return response.data;
  },

  transfer: async (data: TransferRequest) => {
    const response = await api.post('/cashbank/transfer', data);
    return response.data;
  },

  listTransactions: async () => {
    const response = await api.get('/cashbank/transactions');
    return response.data;
  },

  getCashFlow: async (start: Date, end: Date) => {
    const response = await api.get('/cashbank/cashflow', {
      params: { start, end }
    });
    return response.data;
  },

  approve: async (id: number) => {
    const response = await api.post(`/cashbank/approve/${id}`);
    return response.data;
  }
}; 