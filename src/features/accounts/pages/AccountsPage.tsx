import React, { useState } from 'react';
import { AccountList } from '../../../components/accounts/AccountList';
import { AccountForm } from '../../../components/accounts/AccountForm';
import { useAccounts } from '../../../hooks/useAccounts';
import { Account } from '../../../types/account.types';
import { accountService } from '@/api/account/account.api';
import { message } from 'antd';

const ITEMS_PER_PAGE = 10;

const AccountsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { accounts, isLoading, error, refetch } = useAccounts(currentPage, ITEMS_PER_PAGE);
  const [showForm, setShowForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const accountData = accounts || [];
  const totalPages = Math.ceil(accountData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = async (accountData: Partial<Account>) => {
    try {
      if (!accountData.code || !accountData.name || !accountData.type) {
        throw new Error('Kolom yang diperlukan tidak lengkap');
      }
      await accountService.create({
        code: accountData.code,
        name: accountData.name,
        type: accountData.type as 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE',
        category: 'default',
        isActive: true,
        description: accountData.description
      });
      refetch();
      setShowForm(false);
      message.success('Akun berhasil dibuat');
    } catch (err) {
      message.error('Gagal membuat akun: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'));
    }
  };

  const handleEdit = async (id: number, accountData: Partial<Account>) => {
    try {
      await accountService.update(id.toString(), {
        ...accountData,
        type: accountData.type as 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE',
        category: 'default',
        isActive: true
      });
      refetch();
      setSelectedAccount(null);
      message.success('Akun berhasil diperbarui');
    } catch (err) {
      message.error('Gagal memperbarui akun: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      try {
        await accountService.delete(id.toString());
        refetch();
        message.success('Akun berhasil dihapus');
      } catch (err) {
        message.error('Gagal menghapus akun: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'));
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Akun</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Tambah Akun Baru
        </button>
      </div>

      {isLoading && <div>Memuat...</div>}
      {error && <div className="text-red-500">{error}</div>}
      
      <AccountList
        accounts={accountData}
        onEdit={setSelectedAccount}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Tambah Akun</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-4">
              <AccountForm
                onSubmit={handleCreate}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {selectedAccount && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Edit Akun</h2>
              <button 
                onClick={() => setSelectedAccount(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-4">
              <AccountForm 
                account={selectedAccount}
                onSubmit={(data) => handleEdit(selectedAccount.id, data)}
                onCancel={() => setSelectedAccount(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage; 