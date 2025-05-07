import React from 'react';
import { Card, Descriptions, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { purchasePaymentService } from '@/api/purchase/payment.service';

interface PurchasePaymentDetailProps {
  id: string;
}

export const PurchasePaymentDetail: React.FC<PurchasePaymentDetailProps> = ({
  id,
}) => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['purchasePayment', id],
    queryFn: () => purchasePaymentService.getById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: purchasePaymentService.delete,
    onSuccess: () => {
      message.success('Pembayaran berhasil dihapus');
      navigate('/purchase/payment');
    },
    onError: () => {
      message.error('Gagal menghapus pembayaran');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Detail Pembayaran</h1>
        <Space className="w-full md:w-auto">
          <Button 
            onClick={() => navigate('/purchase/payment')}
            className="w-full md:w-auto"
          >
            Kembali
          </Button>
          <Button 
            type="primary" 
            onClick={() => navigate(`/purchase/payment/${id}/edit`)}
            className="w-full md:w-auto"
          >
            Edit
          </Button>
          <Button 
            danger 
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            className="w-full md:w-auto"
          >
            Hapus
          </Button>
        </Space>
      </div>

      {/* Desktop View - Descriptions */}
      <div className="hidden md:block">
        <Card>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Nomor Pembayaran">
              {data?.paymentNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Pembayaran">
              {data?.paymentDate ? new Date(data.paymentDate).toLocaleDateString('id-ID') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Invoice">
              {data?.purchaseInvoice?.invoiceNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Supplier">
              {data?.purchaseInvoice?.supplier?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Jumlah Pembayaran">
              Rp {data?.amount?.toLocaleString('id-ID')}
            </Descriptions.Item>
            <Descriptions.Item label="Akun Pembayaran">
              {data?.paymentAccount?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Catatan" span={2}>
              {data?.notes || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-32">Nomor Pembayaran:</span>
                <span className="text-gray-900">{data?.paymentNumber}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-32">Tanggal Pembayaran:</span>
                <span className="text-gray-900">
                  {data?.paymentDate ? new Date(data.paymentDate).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-32">Invoice:</span>
                <span className="text-gray-900">{data?.purchaseInvoice?.invoiceNumber || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-32">Supplier:</span>
                <span className="text-gray-900">{data?.purchaseInvoice?.supplier?.name || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-32">Jumlah Pembayaran:</span>
                <span className="text-gray-900">Rp {data?.amount?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-32">Akun Pembayaran:</span>
                <span className="text-gray-900">{data?.paymentAccount?.name || '-'}</span>
              </div>
              <div className="flex items-start text-sm">
                <span className="text-gray-500 w-32">Catatan:</span>
                <span className="text-gray-900 flex-1">{data?.notes || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 