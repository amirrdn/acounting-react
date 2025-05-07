import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Space, message } from 'antd';
import { StockTransfer } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';

const StockTransferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stockTransfer, setStockTransfer] = useState<StockTransfer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStockTransfer();
  }, [id]);

  const fetchStockTransfer = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getStockTransfers();
      const transfer = data.find((item: StockTransfer) => item.id === Number(id));
      if (transfer) {
        setStockTransfer(transfer);
      } else {
        message.error('Stock transfer tidak ditemukan');
        navigate('/inventory/stock-transfer');
      }
    } catch (error) {
      console.error('Error fetching stock transfer:', error);
      message.error('Gagal mengambil data stock transfer');
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
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  if (!stockTransfer) return null;

  const tableData = Array.isArray(stockTransfer.items) 
    ? stockTransfer.items.map((item: any) => ({
        ...item,
        key: item.id
      }))
    : [];

  return (
    <Card
      title={`Detail Stock Transfer - ${new Date(stockTransfer.transferDate).toLocaleDateString()}`}
      style={{ margin: '20px' }}
      extra={
        <Space>
          <Button onClick={() => navigate('/inventory/stock-transfer')}>
            Kembali
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Dari Gudang:</strong> {stockTransfer.fromWarehouse?.name || '-'}</p>
        <p><strong>Ke Gudang:</strong> {stockTransfer.toWarehouse?.name || '-'}</p>
        <p><strong>Tanggal:</strong> {new Date(stockTransfer.transferDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {stockTransfer.status}</p>
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default StockTransferDetail; 