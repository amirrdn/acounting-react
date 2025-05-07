export enum Role {
  admin = 'admin',
  sales = 'sales',
  purchase = 'purchase',
  accounting = 'accounting',
  inventory = 'inventory',
  cashier = 'cashier',
  manager = 'manager',
  finance = 'finance'
}

export const ROLES = {
  admin: Role.admin,
  sales: Role.sales,
  purchase: Role.purchase,
  accounting: Role.accounting,
  inventory: Role.inventory,
  cashier: Role.cashier,
  manager: Role.manager,
  finance: Role.finance
};

export const roleLabels: Record<Role, string> = {
  [Role.admin]: 'Administrator',
  [Role.accounting]: 'Akuntansi',
  [Role.sales]: 'Penjualan',
  [Role.purchase]: 'Pembelian',
  [Role.inventory]: 'Gudang',
  [Role.cashier]: 'Kasir',
  [Role.manager]: 'Manager',
  [Role.finance]: 'Keuangan'
}; 