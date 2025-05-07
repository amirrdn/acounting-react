import React from 'react';
import { Table, Button, message, Space, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../../../types/Product';
import { productService } from '@/api/product/product.api';

export const ProductList: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().then((res: { data: Product[] }) => res.data)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      message.success('Produk berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      message.error('Gagal menghapus produk');
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
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name)
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku'
    },
    {
      title: 'Harga Jual',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price)
    },
    {
      title: 'Harga Beli',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => formatCurrency(cost)
    },
    {
      title: 'Stok Minimum',
      dataIndex: 'minimumStock',
      key: 'minimumStock'
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {active ? 'Aktif' : 'Tidak Aktif'}
        </span>
      )
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: unknown, record: Product) => (
        <Space>
          <Link 
            to={`/products/edit/${record.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            <EditOutlined /> Edit
          </Link>
          <Popconfirm
            title="Hapus Produk"
            description="Apakah Anda yakin ingin menghapus produk ini?"
            onConfirm={() => deleteMutation.mutate(record.id.toString())}
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
        <h1 className="text-2xl font-semibold">Daftar Produk</h1>
        <Link to="/products/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={products}
          loading={isLoading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} produk`
          }}
        />
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="text-center">Memuat...</div>
        ) : (
          products?.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">SKU:</span>
                    <span className="text-gray-900">{product.sku || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Harga Jual:</span>
                    <span className="text-gray-900">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Harga Beli:</span>
                    <span className="text-gray-900">{formatCurrency(product.cost)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Stok Min:</span>
                    <span className="text-gray-900">{product.minimumStock}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Link to={`/products/edit/${product.id}`}>
                    <Button type="primary" size="small" icon={<EditOutlined />}>
                      Edit
                    </Button>
                  </Link>
                  <Popconfirm
                    title="Hapus Produk"
                    description="Apakah Anda yakin ingin menghapus produk ini?"
                    onConfirm={() => deleteMutation.mutate(product.id.toString())}
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
