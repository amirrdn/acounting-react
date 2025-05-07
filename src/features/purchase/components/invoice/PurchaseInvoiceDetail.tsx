import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Tag, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { purchaseInvoiceService, PurchaseInvoiceWithItems } from '@/api/purchase/invoice.api';

export const PurchaseInvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<PurchaseInvoiceWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const data = await purchaseInvoiceService.getById(id!);
      setInvoice(data);
    } catch (error) {
      message.error('Gagal mengambil data invoice: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return 'error';
      case 'PAID_PARTIAL':
        return 'warning';
      case 'PAID_FULL':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Memuat...</div>;
  }

  if (!invoice) {
    return <div className="p-4 text-center">Invoice tidak ditemukan</div>;
  }

  return (
    <div className="px-4 md:px-6 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/purchase/invoice')}
          className="w-full md:w-auto"
        >
          Kembali
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header Information */}
        <Card className="shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
              <Tag color={getStatusColor(invoice.status)} className="mt-2">
                {invoice.status}
              </Tag>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                Rp {invoice.totalAmount.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-500">Total Invoice</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Supplier:</span>
                <span className="text-gray-900">{invoice.supplier.name}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Tanggal:</span>
                <span className="text-gray-900">{new Date(invoice.invoiceDate).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Jatuh Tempo:</span>
                <span className="text-gray-900">{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Sudah Dibayar:</span>
                <span className="text-gray-900">Rp {invoice.paidAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Sisa:</span>
                <span className={`font-medium ${invoice.remainingAmount === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  Rp {invoice.remainingAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Items Table */}
        <Card title="Daftar Item" className="shadow-sm">
          <div className="overflow-x-auto">
            <Table 
              columns={[
                {
                  title: 'Produk',
                  key: 'product',
                  render: (_, record) => (
                    <div>
                      <div className="font-medium">{record.product?.code || '-'}</div>
                      <div className="text-sm text-gray-500">{record.product?.name || '-'}</div>
                    </div>
                  ),
                },
                {
                  title: 'Jumlah',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  align: 'right',
                },
                {
                  title: 'Harga',
                  key: 'price',
                  align: 'right',
                  render: (_, record) => (
                    <div>
                      <div>Rp {record.unitPrice.toLocaleString('id-ID')}</div>
                      {record.discount > 0 && (
                        <div className="text-sm text-gray-500">
                          Diskon: Rp {record.discount.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  title: 'Total',
                  key: 'total',
                  align: 'right',
                  render: (_, record) => (
                    <div>
                      <div>Rp {record.subtotal.toLocaleString('id-ID')}</div>
                      {record.taxAmount > 0 && (
                        <div className="text-sm text-gray-500">
                          Pajak: Rp {record.taxAmount.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
              dataSource={invoice.items}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-2">
          {invoice.status !== 'PAID_FULL' && (
            <Button 
              type="primary" 
              onClick={() => navigate(`/purchase/payment/new?invoiceId=${invoice.id}`)}
              className="w-full md:w-auto"
            >
              Buat Pembayaran
            </Button>
          )}
          {invoice.status === 'UNPAID' && (
            <Button 
              onClick={() => navigate(`/purchase/invoice/${invoice.id}/edit`)}
              className="w-full md:w-auto"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 