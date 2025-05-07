import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, message, Tag } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { purchaseReceiptService } from '@/api/purchase/receipt.api';
import { PurchaseReceipt } from '@/types/purchase.types';
import dayjs from 'dayjs';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';

export const PurchaseReceiptList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState<PurchaseReceipt[]>([]);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await purchaseReceiptService.getAll();
      setReceipts(data);
    } catch (error) {
      message.error('Gagal mengambil data receipt');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await purchaseReceiptService.updateStatus(id, 'COMPLETED');
      message.success('Receipt berhasil disetujui');
      fetchReceipts();
    } catch (error) {
      message.error('Gagal menyetujui receipt');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await purchaseReceiptService.updateStatus(id, 'DRAFT');
      message.success('Receipt berhasil ditolak');
      fetchReceipts();
    } catch (error) {
      message.error('Gagal menolak receipt');
    }
  };

  const columns = [
    {
      title: 'Nomor Receipt',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: 'Tanggal',
      dataIndex: 'receiptDate',
      key: 'receiptDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: 'Supplier',
      dataIndex: ['purchaseOrder', 'supplier', 'name'],
      key: 'supplier',
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `Rp ${amount.toLocaleString()}`,
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'COMPLETED' ? 'success' : 'warning'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: PurchaseReceipt) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/purchase/receipts/${record.id}/edit`)}
          >
            Edit
          </Button>
          {record.status === 'DRAFT' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record.id)}
              >
                Setujui
              </Button>
              <Button 
                type="link" 
                danger 
                onClick={() => handleDelete(record.id)}
              >
                Hapus
              </Button>
            </>
          )}
          {record.status === 'COMPLETED' && (
            <Button 
              type="link" 
              danger 
              icon={<CloseOutlined />}
              onClick={() => handleReject(record.id)}
            >
              Tolak
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      await purchaseReceiptService.delete(id);
      message.success('Receipt berhasil dihapus');
      fetchReceipts();
    } catch (error) {
      message.error('Gagal menghapus receipt');
    }
  };

  return (
    <Card
      title="Daftar Purchase Receipt"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/purchases/receipts/new')}>
          Buat Receipt Baru
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={receipts}
        loading={loading}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          responsive: true,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
      />
    </Card>
  );
}; 