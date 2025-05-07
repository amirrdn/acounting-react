import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Space, message } from 'antd';
import { StockOpname } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';

const StockOpnameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stockOpname, setStockOpname] = useState<StockOpname | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStockOpname();
  }, [id]);

  const fetchStockOpname = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getStockOpnames();
      const opname = data.find((item: StockOpname) => item.id === Number(id));
      if (opname) {
        setStockOpname(opname);
      } else {
        message.error('Stock opname tidak ditemukan');
        navigate('/inventory/stock-opname');
      }
    } catch (error) {
      console.error('Error fetching stock opname:', error);
      message.error('Gagal mengambil data stock opname');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (_text: string, record: any) => record.product?.name || '-',
    },
    {
      title: 'Stok Sistem',
      dataIndex: 'systemQty',
      key: 'systemQty',
    },
    {
      title: 'Stok Aktual',
      dataIndex: 'actualQty',
      key: 'actualQty',
    },
    {
      title: 'Selisih',
      dataIndex: 'diffQty',
      key: 'diffQty',
      render: (diffQty: number) => (
        <span style={{ color: diffQty > 0 ? 'green' : diffQty < 0 ? 'red' : 'inherit' }}>
          {diffQty > 0 ? '+' : ''}{diffQty}
        </span>
      ),
    },
  ];

  if (!stockOpname) return null;

  return (
    <Card
      title={`Detail Stock Opname - ${new Date(stockOpname.date).toLocaleDateString()}`}
      style={{ margin: '20px' }}
      extra={
        <Space>
          <Button onClick={() => navigate('/inventory/stock-opname')}>
            Kembali
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Gudang:</strong> {stockOpname.warehouse?.name || '-'}</p>
        <p><strong>Tanggal:</strong> {new Date(stockOpname.date).toLocaleDateString()}</p>
      </div>

      <Table
        columns={columns}
        dataSource={stockOpname.items || []}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default StockOpnameDetail; 