export interface Account {
  id: number;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense' | 'cash' | 'bank';
  parent?: Account;
  createdAt: string;
  updatedAt: string;
} 