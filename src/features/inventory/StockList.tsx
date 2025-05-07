import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Card } from 'antd';
import { Stock } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';
import { useNavigate } from 'react-router-dom';

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getStocks();
      setStocks(data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'SKU',
      dataIndex: ['product', 'sku'],
      key: 'sku',
    },
    {
      title: 'Kuantitas',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Stock) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record.product.id)}>
            Lihat
          </Button>
          <Button type="link" onClick={() => handleEdit(record.product.id)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (id: number) => {
    navigate(`/inventory/stock-card/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/inventory/stock-adjustment/${id}`);
  };

  return (
    <Card 
      title="Daftar Stok" 
      style={{ margin: '20px' }}
      extra={
        <Space>
          <Button type="primary" onClick={() => navigate('/inventory/stock-adjustment')}>
            Penyesuaian Stok
          </Button>
          <Button type="primary" onClick={() => navigate('/inventory/stock-transfer')}>
            Transfer Stok
          </Button>
          <Button type="primary" onClick={() => navigate('/inventory/stock-opname')}>
            Stock Opname
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={stocks}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default StockList; 