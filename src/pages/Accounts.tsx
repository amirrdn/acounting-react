import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  parent: Account | null;
}

const Accounts: React.FC = () => {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await axios.get('/api/accounts');
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderAccount = (account: Account, level: number = 0) => {
    const paddingLeft = level * 20;
    return (
      <React.Fragment key={account.id}>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ paddingLeft }}>
            {account.code}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {account.name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {account.type}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {account.parent?.name || '-'}
          </td>
        </tr>
        {accounts
          .filter((a: Account) => a.parent?.id === account.id)
          .map((child: Account) => renderAccount(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Daftar Akun</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Tambah Akun
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Tipe</th>
              <th>Induk</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts
              .filter((account: Account) => !account.parent)
              .map((account: Account) => renderAccount(account))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts; 