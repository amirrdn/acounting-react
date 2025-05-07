import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Card, Tag, message } from 'antd';
import { StockTransfer } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';
import { useNavigate } from 'react-router-dom';

const StockTransferList: React.FC = () => {
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStockTransfers();
  }, []);

  const fetchStockTransfers = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getStockTransfers();
      setStockTransfers(data);
    } catch (error) {
      console.error('Error fetching stock transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transferDate',
      key: 'transferDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Dari Gudang',
      dataIndex: ['fromWarehouse', 'name'],
      key: 'fromWarehouse',
    },
    {
      title: 'Ke Gudang',
      dataIndex: ['toWarehouse', 'name'],
      key: 'toWarehouse',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'APPROVED' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: StockTransfer) => (
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
    navigate(`/inventory/stock-transfer/${id}`);
  };

  const handleApprove = async (id: number) => {
    try {
      await inventoryService.approveStockTransfer(id);
      message.success('Transfer stok berhasil diapprove');
      fetchStockTransfers();
    } catch (error) {
      console.error('Error approving stock transfer:', error);
      message.error('Gagal mengapprove transfer stok');
    }
  };

  return (
    <Card 
      title="Daftar Transfer Stok" 
      style={{ margin: '20px' }}
      extra={
        <Button type="primary" onClick={() => navigate('/inventory/stock-transfer/new')}>
          Buat Transfer Stok
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={stockTransfers}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default StockTransferList; 