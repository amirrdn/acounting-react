export enum TransactionStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
  }
  
  export const statusLabels: Record<TransactionStatus, string> = {
    [TransactionStatus.DRAFT]: 'Draft',
    [TransactionStatus.PENDING]: 'Pending',
    [TransactionStatus.APPROVED]: 'Approved',
    [TransactionStatus.REJECTED]: 'Rejected',
    [TransactionStatus.CANCELLED]: 'Cancelled',
    [TransactionStatus.COMPLETED]: 'Completed',
  };
  
  export const statusColors: Record<TransactionStatus, string> = {
    [TransactionStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [TransactionStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [TransactionStatus.APPROVED]: 'bg-green-100 text-green-800',
    [TransactionStatus.REJECTED]: 'bg-red-100 text-red-800',
    [TransactionStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [TransactionStatus.COMPLETED]: 'bg-green-100 text-green-800',
  };