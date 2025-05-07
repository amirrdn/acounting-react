import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Card, Space, Button } from 'antd';
import { inventoryService } from '../../api/inventory';
import { StockMutation } from '../../types/inventory/index';

const StockCard: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [mutations, setMutations] = useState<StockMutation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchStockCard(parseInt(productId));
    }
  }, [productId]);

  const fetchStockCard = async (id: number) => {
    try {
      setLoading(true);
      const data = await inventoryService.getStockCard(id);
      setMutations(data);
    } catch (error) {
      console.error('Error fetching stock card:', error);
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
      title: 'Referensi',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type === 'IN' ? 'Masuk' : 'Keluar',
    },
    {
      title: 'Kuantitas',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: StockMutation) => (
        <span style={{ color: record.type === 'IN' ? 'green' : 'red' }}>
          {record.type === 'IN' ? '+' : '-'}{quantity}
        </span>
      ),
    },
  ];

  return (
    <Card 
      title="Kartu Stok" 
      style={{ margin: '20px' }}
      extra={
        <Space>
          <Button type="primary" onClick={() => window.history.back()}>
            Kembali
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={mutations}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default StockCard; 