import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Card } from 'antd';
import { StockOpname } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';
import { useNavigate } from 'react-router-dom';

const StockOpnameList: React.FC = () => {
  const [stockOpnames, setStockOpnames] = useState<StockOpname[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStockOpnames();
  }, []);

  const fetchStockOpnames = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getStockOpnames();
      setStockOpnames(data);
    } catch (error) {
      console.error('Error fetching stock opnames:', error);
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
      title: 'Gudang',
      dataIndex: ['warehouse', 'name'],
      key: 'warehouse',
    },
    {
      title: 'Jumlah Item',
      key: 'items',
      render: (_: any, record: StockOpname) => record.items.length,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: StockOpname) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record.id)}>
            Lihat Detail
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (id: number) => {
    navigate(`/inventory/stock-opname/${id}`);
  };

  return (
    <Card 
      title="Daftar Stock Opname" 
      style={{ margin: '20px' }}
      extra={
        <Button type="primary" onClick={() => navigate('/inventory/stock-opname/new')}>
          Buat Stock Opname
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={stockOpnames}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default StockOpnameList; 