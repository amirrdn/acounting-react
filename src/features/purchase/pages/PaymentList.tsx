import React from 'react';
import { Card, Table, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PurchasePayment } from '@/types/purchase.types';
import { purchasePaymentService } from '@/api/purchase/payment.service';

export const PaymentList: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = React.useState<PurchasePayment[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await purchasePaymentService.getAll();
      setPayments(data);
    } catch (error) {
      message.error('Gagal mengambil data pembayaran: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayments();
  }, []);

  const columns = [
    {
      title: 'Nomor Pembayaran',
      dataIndex: 'paymentNumber',
      key: 'paymentNumber',
    },
    {
      title: 'Tanggal',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
    },
    {
      title: 'Jumlah',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: PurchasePayment) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/purchases/payments/${record.id}`)}>
            Lihat
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Daftar Pembayaran"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/purchases/payments/new')}
        >
          Buat Pembayaran Baru
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
}; 