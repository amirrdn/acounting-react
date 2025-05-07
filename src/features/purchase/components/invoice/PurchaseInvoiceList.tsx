import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { purchaseInvoiceService } from '@/api/purchase/invoice.api';
import { PurchaseInvoice } from '@/api/purchase/types';

export const PurchaseInvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await purchaseInvoiceService.getAll();
      setInvoices(data);
    } catch (error) {
      message.error('Gagal mengambil data invoice: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await purchaseInvoiceService.delete(id);
      message.success('Invoice berhasil dihapus');
      fetchInvoices();
    } catch (error) {
      message.error('Gagal menghapus invoice: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
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

  const columns = [
    {
      title: 'Nomor Invoice',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Tanggal Invoice',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Tanggal Jatuh Tempo',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
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
      render: (total: number) => `Rp ${total.toLocaleString('id-ID')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: PurchaseInvoice) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/purchases/invoices/${record.id}`)}>
            Lihat
          </Button>
          {record.status === 'UNPAID' && (
            <>
              <Button type="link" onClick={() => navigate(`/purchases/invoices/${record.id}/edit`)}>
                Edit
              </Button>
              <Button 
                type="link" 
                danger 
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
                    handleDelete(record.id);
                  }
                }}
              >
                Hapus
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Daftar Invoice Pembelian</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/purchases/invoices/new')}
          className="w-full md:w-auto"
        >
          Buat Invoice Baru
        </Button>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Table 
          columns={columns} 
          dataSource={invoices}
          rowKey="id"
          loading={loading}
        />
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center">Memuat...</div>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{invoice.invoiceNumber}</h3>
                    <Tag color={getStatusColor(invoice.status)} className="mt-1">
                      {invoice.status}
                    </Tag>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Rp {invoice.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Supplier:</span>
                    <span className="text-gray-900">{invoice.supplier?.name}</span>
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

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/purchases/invoices/${invoice.id}`)}
                  >
                    Lihat
                  </Button>
                  {invoice.status === 'UNPAID' && (
                    <>
                      <Button
                        size="small"
                        onClick={() => navigate(`/purchases/invoices/${invoice.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        danger
                        size="small"
                        onClick={() => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
                            handleDelete(invoice.id);
                          }
                        }}
                      >
                        Hapus
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}; 