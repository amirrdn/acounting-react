import React from 'react';
import { Card, Tabs } from 'antd';
import { CashInForm } from '../components/CashInForm';
import { CashOutForm } from '../components/CashOutForm';
import { TransferForm } from '../components/TransferForm';
import { TransactionList } from '../components/TransactionList';

export const CashBankPage: React.FC = () => {
  const items = [
    {
      key: '1',
      label: 'Kas Masuk',
      children: <CashInForm />,
    },
    {
      key: '2',
      label: 'Kas Keluar',
      children: <CashOutForm />,
    },
    {
      key: '3',
      label: 'Transfer',
      children: <TransferForm />,
    },
    {
      key: '4',
      label: 'Riwayat Transaksi',
      children: <TransactionList />,
    },
  ];

  return (
    <div className="p-4">
      <Card title="Kas & Bank">
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
}; 