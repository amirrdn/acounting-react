import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, message } from 'antd';
import { StockAdjustment } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';

const StockAdjustmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stockAdjustment, setStockAdjustment] = useState<StockAdjustment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStockAdjustment();
  }, [id]);

  const fetchStockAdjustment = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getStockAdjustments();
      const adjustment = data.find((item: StockAdjustment) => item.id === Number(id));
      if (adjustment) {
        setStockAdjustment(adjustment);
      } else {
        message.error('Penyesuaian stok tidak ditemukan');
        navigate('/inventory/stock-adjustment');
      }
    } catch (error) {
      console.error('Error fetching stock adjustment:', error);
      message.error('Gagal mengambil data penyesuaian stok');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await inventoryService.approveStockAdjustment(Number(id));
      message.success('Penyesuaian stok berhasil diapprove');
      fetchStockAdjustment();
    } catch (error) {
      console.error('Error approving stock adjustment:', error);
      message.error('Gagal mengapprove penyesuaian stok');
    }
  };

  if (!stockAdjustment) return null;

  return (
    <Card 
      title="Detail Penyesuaian Stok" 
      style={{ margin: '20px' }}
      extra={
        stockAdjustment.status === 'DRAFT' && (
          <Button type="primary" onClick={handleApprove}>
            Approve
          </Button>
        )
      }
    >
      <Table
        dataSource={[stockAdjustment]}
        rowKey="id"
        loading={loading}
        pagination={false}
        columns={[
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
              <span style={{ 
                color: status === 'APPROVED' ? 'green' : 
                       status === 'DRAFT' ? 'orange' : 'red' 
              }}>
                {status}
              </span>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default StockAdjustmentDetail; 