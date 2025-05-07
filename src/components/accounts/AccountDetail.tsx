import React from 'react';
import { Account } from '../../types/account.types';

interface AccountDetailProps {
  account: Account;
}

export const AccountDetail: React.FC<AccountDetailProps> = ({ account }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Detail Akun</h2>
      <div className="space-y-4">
        <div>
          <label className="font-medium">Kode:</label>
          <p>{account.code}</p>
        </div>
        <div>
          <label className="font-medium">Nama:</label>
          <p>{account.name}</p>
        </div>
        <div>
          <label className="font-medium">Tipe:</label>
          <p>{account.type}</p>
        </div>
        <div>
          <label className="font-medium">Saldo:</label>
          <p>{account.balance?.toLocaleString()}</p>
        </div>
        <div>
          <label className="font-medium">Deskripsi:</label>
          <p>{account.description || '-'}</p>
        </div>
        <div>
          <label className="font-medium">Dibuat:</label>
          <p>{new Date(account.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="font-medium">Diperbarui:</label>
          <p>{new Date(account.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
