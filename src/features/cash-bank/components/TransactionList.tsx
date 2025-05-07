import React from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { cashBankService } from '@/api/cash-bank/cash-bank.api';
import { formatCurrency } from '@/utils/format';

interface Transaction {
  id: number;
  date: string;
  type: 'IN' | 'OUT' | 'TRANSFER';
  amount: number;
  description: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  sourceAccount: {
    id: number;
    code: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  destinationAccount: {
    id: number;
    code: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  branch: {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const TransactionList: React.FC = () => {
  const { data: transactions = [], refetch } = useQuery({
    queryKey: ['cash-bank-transactions'],
    queryFn: async () => {
      try {
        const response = await cashBankService.listTransactions();
        return response || [];
      } catch (error) {
        message.error('Gagal mengambil data transaksi: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
        return [];
      }
    },
  });

  const handleApprove = async (id: number) => {
    try {
      await cashBankService.approve(id);
      message.success('Transaksi berhasil disetujui');
      refetch();
    } catch (error) {
      message.error('Gagal menyetujui transaksi');
    }
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Cabang',
      dataIndex: ['branch', 'name'],
      key: 'branch',
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'IN' ? 'green' : type === 'OUT' ? 'red' : 'blue';
        const text = type === 'IN' ? 'Masuk' : type === 'OUT' ? 'Keluar' : 'Transfer';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Jumlah',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Keterangan',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Akun Sumber',
      dataIndex: ['sourceAccount', 'name'],
      key: 'sourceAccount',
      render: (_: any, record: Transaction) =>
        record.sourceAccount ? `${record.sourceAccount.code} - ${record.sourceAccount.name}` : '-',
    },
    {
      title: 'Akun Tujuan',
      dataIndex: ['destinationAccount', 'name'],
      key: 'destinationAccount',
      render: (_text: string, record: Transaction) =>
        record.destinationAccount ? `${record.destinationAccount.code} - ${record.destinationAccount.name}` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (isApproved: boolean) => (
        <Tag color={isApproved ? 'green' : 'orange'}>
          {isApproved ? 'Disetujui' : 'Menunggu'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Transaction) => (
        <Space>
          {!record.isApproved && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleApprove(record.id)}
            >
              Setujui
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={transactions}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}; 