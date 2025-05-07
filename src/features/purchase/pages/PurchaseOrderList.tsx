import React from 'react';
import { Card, Table, Button, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PurchaseOrder } from '@/types/purchase.types';
import { purchaseOrderService } from '@/api/purchase/order.api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export const PurchaseOrderList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderService.getAll();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      message.error('Gagal mengambil data PO: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'default';
      case 'APPROVED':
        return 'processing';
      case 'SENT':
        return 'warning';
      case 'RECEIVED_PARTIAL':
        return 'success';
      case 'RECEIVED_FULL':
        return 'success';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Nomor PO',
      dataIndex: 'poNumber',
      key: 'poNumber',
    },
    {
      title: 'Tanggal',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => dayjs(date).format('DD MMMM YYYY'),
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === 'DRAFT' ? 'Draft'
            : status === 'APPROVED' ? 'Disetujui'
            : status === 'SENT' ? 'Dikirim'
            : status === 'RECEIVED_PARTIAL' ? 'Diterima Sebagian'
            : status === 'RECEIVED_FULL' ? 'Diterima Lengkap'
            : status}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: PurchaseOrder) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/purchase/orders/${record.id}`)}>
            Lihat
          </Button>
          <Button type="link" onClick={() => navigate(`/purchase/orders/edit/${record.id}`)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Daftar Purchase Order"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/purchase/order/new')}
        >
          Buat PO Baru
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
}; 