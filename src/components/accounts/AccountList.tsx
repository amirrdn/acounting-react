import React from 'react';
import { Account } from '../../types/account.types';

interface AccountListProps {
  accounts: Account[];
  onEdit?: (account: Account) => void;
  onDelete?: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export const AccountList: React.FC<AccountListProps> = ({ 
  accounts, 
  onEdit, 
  onDelete,
  currentPage,
  totalPages,
  onPageChange}) => {
  const formatBalance = (balance: any) => {
    const numericBalance = typeof balance === 'string' 
      ? parseFloat(balance.replace(/[^0-9.-]+/g, '')) 
      : Number(balance);

    if (isNaN(numericBalance)) {
      return 'Rp 0,00';
    }

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericBalance);
  };

  const getTypeColor = (type: string) => {
    return type === 'cash' || type === 'ASSET' ? 'bg-green-100 text-green-800' :
           type === 'liability' || type === 'LIABILITY' ? 'bg-red-100 text-red-800' :
           type === 'equity' || type === 'EQUITY' ? 'bg-blue-100 text-blue-800' :
           type === 'revenue' || type === 'REVENUE' ? 'bg-purple-100 text-purple-800' :
           'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-4">
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => {
              const numericBalance = typeof account.balance === 'string' 
                ? parseFloat(account.balance.replace(/[^0-9.-]+/g, '')) 
                : Number(account.balance);

              return (
                <tr 
                  key={account.id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                    <span className={`font-medium ${
                      numericBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatBalance(account.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit?.(account)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(account.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {accounts.map((account) => {
          const numericBalance = typeof account.balance === 'string' 
            ? parseFloat(account.balance.replace(/[^0-9.-]+/g, '')) 
            : Number(account.balance);

          return (
            <div key={account.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{account.name}</h3>
                  <p className="text-xs text-gray-500">Kode: {account.code}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                  {account.type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${
                  numericBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatBalance(account.balance)}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => onEdit?.(account)}
                    className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(account.id)}
                    className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === page
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
