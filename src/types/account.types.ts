export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
  CASH = 'cash',
  BANK = 'bank'
}

export interface Account {
  id: number;
  code: string;
  name: string;
  type: AccountType | 'cash' | 'liability' | 'equity' | 'revenue' | 'expense' | 'bank';
  balance: number | string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  parent?: Account | null;
}
