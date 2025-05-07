import React from 'react';
import { Card, Table, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const PurchaseReturnList: React.FC = () => {
  const columns = [
    {
      title: 'Nomor Return',
      dataIndex: 'returnNumber',
      key: 'returnNumber',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link">Hapus</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Daftar Purchase Return"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          Buat Return Baru
        </Button>
      }
    >
      <Table columns={columns} />
    </Card>
  );
}; 