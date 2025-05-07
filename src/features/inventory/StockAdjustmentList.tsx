import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Card, Tag, message } from 'antd';
import { StockAdjustment } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';
import { useNavigate } from 'react-router-dom';

const StockAdjustmentList: React.FC = () => {
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStockAdjustments();
  }, []);

  const fetchStockAdjustments = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getStockAdjustments();
      setStockAdjustments(data);
    } catch (error) {
      console.error('Error fetching stock adjustments:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Produk',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'Kuantitas',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <span style={{ color: quantity > 0 ? 'green' : 'red' }}>
          {quantity > 0 ? '+' : ''}{quantity}
        </span>
      ),
    },
    {
      title: 'Alasan',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'APPROVED' ? 'green' : status === 'DRAFT' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: StockAdjustment) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record.id)}>
            Lihat Detail
          </Button>
          {record.status === 'DRAFT' && (
            <Button type="link" onClick={() => handleApprove(record.id)}>
              Approve
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleView = (id: number) => {
    navigate(`/inventory/stock-adjustment/${id}`);
  };

  const handleApprove = async (id: number) => {
    try {
      await inventoryService.approveStockAdjustment(id);
      message.success('Penyesuaian stok berhasil diapprove');
      fetchStockAdjustments();
    } catch (error) {
      console.error('Error approving stock adjustment:', error);
      message.error('Gagal mengapprove penyesuaian stok');
    }
  };

  return (
    <Card 
      title="Daftar Penyesuaian Stok" 
      style={{ margin: '20px' }}
      extra={
        <Button type="primary" onClick={() => navigate('/inventory/stock-adjustment/new')}>
          Buat Penyesuaian Stok
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={stockAdjustments}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default StockAdjustmentList; 