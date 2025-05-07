import React from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPayments, deletePayment } from '@/api/purchase/payment.api';

export const PurchasePaymentList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['purchasePayments'],
    queryFn: getPayments,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      message.success('Pembayaran berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['purchasePayments'] });
    },
    onError: (error: any) => {
      message.error('Gagal menghapus pembayaran: ' + (error.message || 'Terjadi kesalahan'));
    },
  });

  const handleDelete = (id: number, record: any) => {
    const hasInvoice = record.purchaseInvoice !== null;
    
    Modal.confirm({
      title: 'Konfirmasi Hapus',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Apakah Anda yakin ingin menghapus pembayaran ini?</p>
          {!hasInvoice && (
            <p style={{ color: 'red' }}>
              <strong>Peringatan:</strong> Pembayaran ini tidak terkait dengan purchase invoice. 
              Penghapusan mungkin gagal karena masalah di backend.
            </p>
          )}
        </div>
      ),
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      onOk: () => {
        deleteMutation.mutate(id);
      },
    });
  };

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
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Invoice',
      dataIndex: ['purchaseInvoice', 'invoiceNumber'],
      key: 'invoiceNumber',
      render: (text: string, record: any) => record.purchaseInvoice ? text : '-',
    },
    {
      title: 'Supplier',
      dataIndex: ['purchaseInvoice', 'supplier', 'name'],
      key: 'supplier',
      render: (_text: string, record: any) => record.purchaseInvoice?.supplier?.name || '-',
    },
    {
      title: 'Jumlah',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`,
    },
    {
      title: 'Akun Pembayaran',
      dataIndex: ['paymentAccount', 'name'],
      key: 'paymentAccount',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/purchase/payment/${record.id}`)}>
            Detail
          </Button>
          <Button type="link" onClick={() => navigate(`/purchase/payment/${record.id}/edit`)}>
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record.id, record)}
            loading={deleteMutation.isPending}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Daftar Pembayaran Pembelian</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/purchase/payment/new')}
          className="w-full md:w-auto"
        >
          Buat Pembayaran Baru
        </Button>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Table 
          columns={columns} 
          dataSource={payments} 
          loading={isLoading}
          rowKey="id"
        />
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="text-center">Memuat...</div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{payment.paymentNumber}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Tanggal:</span>
                    <span className="text-gray-900">{new Date(payment.paymentDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Invoice:</span>
                    <span className="text-gray-900">{payment.purchaseInvoice?.invoiceNumber || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Supplier:</span>
                    <span className="text-gray-900">{payment.purchaseInvoice?.supplier?.name || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Jumlah:</span>
                    <span className="text-gray-900">Rp {payment.amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Akun:</span>
                    <span className="text-gray-900">{payment.paymentAccount?.name || '-'}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/purchase/payment/${payment.id}`)}
                  >
                    Detail
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/purchase/payment/${payment.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    size="small"
                    onClick={() => handleDelete(payment.id, payment)}
                    loading={deleteMutation.isPending}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 