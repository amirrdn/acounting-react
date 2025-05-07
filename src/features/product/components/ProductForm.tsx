import React, { useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, message, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ProductFormData } from '../../../types/Product';
import { productService } from '@/api/product';
import { warehouseApi } from '@/api/warehouse/warehouseApi';
import moment from 'moment';

export const ProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const response = await productService.getById(id);
      if (!response) throw new Error('Product not found');
      return response;
    },
    enabled: isEditing && !!id
  });

  const { data: warehouses, isLoading: isLoadingWarehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseApi.getAll().then((res: { data: any[] }) => res.data)
  });

  const [initialStocks, setInitialStocks] = useState<{ warehouse_id: number; quantity: number }[]>([]);

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => productService.create(data as any),
    onSuccess: () => {
      message.success('Produk berhasil ditambahkan');
      navigate('/products');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Gagal menambahkan produk');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      if (!id) throw new Error('Product ID is required');
      return productService.update(id, data as any);
    },
    onSuccess: () => {
      message.success('Produk berhasil diperbarui');
      navigate('/products');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Gagal memperbarui produk');
    }
  });

  React.useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        stocks: product.productStocks?.reduce((acc: any, stock: any) => {
          acc[stock.warehouse.id] = stock.quantity;
          return acc;
        }, {}) || {}
      });
      
      if (product.productStocks && product.productStocks.length > 0) {
        const stocks = product.productStocks.map((stock: { warehouse: { id: number }; quantity: number }) => ({
          warehouse_id: stock.warehouse.id,
          quantity: stock.quantity
        }));
        setInitialStocks(stocks);
      }
    }
  }, [product, form]);

  const onFinish = (values: ProductFormData) => {
    const dataToSubmit = {
      ...values,
      initial_stocks: initialStocks
    };

    if (isEditing) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const isLoading = 
    isLoadingProduct || 
    createMutation.isPending || 
    updateMutation.isPending;

  const stockMutationsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Referensi',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span className={`${type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'IN' ? 'Masuk' : 'Keluar'}
        </span>
      ),
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm:ss'),
    },
  ];

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md mt-4 md:mb-10">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
        {isEditing ? 'Edit Produk' : 'Tambah Produk'}
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isLoading}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Nama Produk"
            rules={[{ required: true, message: 'Nama produk wajib diisi' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'SKU wajib diisi' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="Harga Jual"
            rules={[{ required: true, message: 'Harga jual wajib diisi' }]}
          >
            <InputNumber
              className="w-full rounded-md"
              formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => (value ? Number(value.replace(/Rp\s?|(,*)/g, '')) : 0) as unknown as 0}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="cost"
            label="Harga Beli"
            rules={[{ required: true, message: 'Harga beli wajib diisi' }]}
          >
            <InputNumber
              className="w-full rounded-md"
              formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => (value ? Number(value.replace(/Rp\s?|(,*)/g, '')) : 0) as unknown as 0}
              min={0}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="minimumStock"
            label="Stok Minimum"
            rules={[{ required: true, message: 'Stok minimum wajib diisi' }]}
          >
            <InputNumber className="w-full rounded-md" min={0} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status Aktif"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>

        <div className="border-t mt-6 pt-6">
          <h2 className="text-lg font-medium mb-4">Stok Awal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingWarehouses ? (
              <div className="text-center py-4 col-span-2">Memuat data gudang...</div>
            ) : (
              warehouses?.map((warehouse: { id: number; name: string }) => (
                <Form.Item
                  key={warehouse.id}
                  label={`Stok di ${warehouse.name}`}
                  name={['stocks', warehouse.id]}
                  initialValue={0}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              ))
            )}
          </div>
        </div>

        <Form.Item className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <Button 
            onClick={() => navigate('/products')}
            className="hover:bg-gray-100 mr-2"
          >
            Batal
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
          </Button>
        </Form.Item>
      </Form>

      {isEditing && product?.stockMutations && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-medium mb-4">Riwayat Mutasi Stok</h2>
          
          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <Table
              columns={stockMutationsColumns}
              dataSource={product.stockMutations}
              rowKey="id"
              pagination={false}
              className="border rounded-lg"
              scroll={{ x: true }}
            />
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {product.stockMutations.map((mutation: { 
              id: number; 
              type: string; 
              reference: string; 
              quantity: number; 
              date: string 
            }) => (
              <div key={mutation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">ID: {mutation.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      mutation.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mutation.type === 'IN' ? 'Masuk' : 'Keluar'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Referensi:</span>
                      <span className="text-gray-900">{mutation.reference || '-'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Jumlah:</span>
                      <span className="text-gray-900">{mutation.quantity}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Tanggal:</span>
                      <span className="text-gray-900">
                        {moment(mutation.date).format('DD/MM/YYYY HH:mm:ss')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
