import React from 'react';
import { Table, Button, message, Space, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sale } from '../../../types/sales.types';
import { SalesService } from '../../../services/sales.service';
import moment from 'moment';

export const SalesList: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => SalesService.getAllSales()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SalesService.deleteSale(id),
    onSuccess: () => {
      message.success('Penjualan berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: () => {
      message.error('Gagal menghapus penjualan');
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR' 
    }).format(value);
  };

  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Pelanggan',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => formatCurrency(total),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          status === 'completed' ? 'bg-green-100 text-green-800' : 
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {status === 'completed' ? 'Lunas' : 
           status === 'pending' ? 'Menunggu' : 
           'Batal'}
        </span>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: unknown, record: Sale) => (
        <Space>
          <Link 
            to={`/sales/edit/${record.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            <EditOutlined /> Edit
          </Link>
          <Popconfirm
            title="Hapus Penjualan"
            description="Apakah Anda yakin ingin menghapus penjualan ini?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              loading={deleteMutation.isPending}
            >
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Daftar Penjualan</h1>
        <Link to="/sales/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Tambah Penjualan
          </Button>
        </Link>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={sales}
          loading={isLoading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} penjualan`
          }}
        />
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="text-center">Memuat...</div>
        ) : (
          sales?.map((sale: Sale) => (
            <div key={sale.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">#{sale.invoice_number}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sale.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {sale.status === 'completed' ? 'Lunas' : 
                     sale.status === 'pending' ? 'Menunggu' : 
                     'Batal'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Tanggal:</span>
                    <span className="text-gray-900">{moment(sale.date).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Pelanggan:</span>
                    <span className="text-gray-900">{sale.customer?.name || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Total:</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(sale.total)}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Link to={`/sales/edit/${sale.id}`}>
                    <Button type="primary" size="small" icon={<EditOutlined />}>
                      Edit
                    </Button>
                  </Link>
                  <Popconfirm
                    title="Hapus Penjualan"
                    description="Apakah Anda yakin ingin menghapus penjualan ini?"
                    onConfirm={() => deleteMutation.mutate(sale.id)}
                    okText="Ya"
                    cancelText="Tidak"
                  >
                    <Button 
                      danger 
                      size="small"
                      icon={<DeleteOutlined />}
                      loading={deleteMutation.isPending}
                    >
                      Hapus
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 