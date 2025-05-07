import React, { useState, useEffect } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, Space, Table, InputNumber, message } from 'antd';
import { SaveOutlined, RollbackOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { PurchaseRequestItem } from '@/types/purchase.types';
import { useNavigate } from 'react-router-dom';
import { purchaseRequestService } from '@/api/purchase/request.api';
import { departmentApi, Department } from '@/api/department/departmentApi';
import { branchService, Branch } from '@/api/branch';
import { warehouseApi } from '@/api/warehouse/warehouseApi';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/api/product/product.api';
import { Warehouse } from '@/types/warehouse.types';
import { PurchaseRequest } from '@/types/purchase.types';
import { Product } from '@/types/Product';

const { Option } = Select;

export const PurchaseRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [items, setItems] = useState<PurchaseRequestItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingwarehous, setLoadingwarehous] = useState<boolean>(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [branchLoading, setBranchLoading] = useState<boolean>(false);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().then((res) => res.data)
  });

  useEffect(() => {
    fetchDepartments();
    fetchBranches();
    fetchWarehouses();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentApi.getAll();
      setDepartments(data);
    } catch (error: any) {
      message.error('Gagal mengambil data departemen: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setBranchLoading(true);
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error: any) {
      message.error('Gagal mengambil data cabang: ' + error.message);
    } finally {
      setBranchLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoadingwarehous(true);
      const response = await warehouseApi.getAll();
      setWarehouses(response.data);
    } catch (error: any) {
      message.error('Gagal mengambil data warehouse: ' + error.message);
    } finally {
      setLoadingwarehous(false);
    }
  };
  

  const onFinish = async (values: any) => {
    try {
      const requestData: Partial<PurchaseRequest> = {
        ...values,
        items: items.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            price: item.product.price,
            cost: item.product.cost,
            is_active: item.product.is_active,
            minimumStock: item.product.minimumStock,
            productStocks: { id: item.product.productStocks.id }
          },
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes
        }))
      };

      await purchaseRequestService.create(requestData);
      message.success('Purchase request berhasil dibuat');
      navigate('/purchase/request');
    } catch (error: any) {
      message.error(error.message || 'Terjadi kesalahan saat membuat purchase request');
    }
  };

  const addItem = () => {
    const newItem: PurchaseRequestItem = {
      id: Date.now().toString(),
      product: { 
        id: 0, 
        name: '', 
        sku: '', 
        price: 0, 
        cost: 0, 
        is_active: true, 
        minimumStock: 0,
        productStocks: { id: 0 }
      },
      quantity: 1,
      unit: '',
      notes: '',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, _record: PurchaseRequestItem, index: number) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Pilih Produk"
          loading={isLoadingProducts}
          onChange={(value) => {
            const selectedProduct = products?.find((p: Product) => p.id === parseInt(value));
            const updatedItems = [...items];
            updatedItems[index].product = selectedProduct ? {
              ...selectedProduct,
              productStocks: { id: selectedProduct.productStocks?.[0]?.id || 0 }
            } : { 
              id: parseInt(value), 
              name: '', 
              sku: '', 
              price: 0, 
              cost: 0, 
              is_active: true, 
              minimumStock: 0, 
              productStocks: { id: 0 }
            };
            setItems(updatedItems);
          }}
        >
          {products?.map((product: Product) => (
            <Option key={product.id} value={product.id}>
              {product.name} - {product.code}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, _record: PurchaseRequestItem, index: number) => (
        <InputNumber
          min={1}
          defaultValue={1}
          onChange={(value) => {
            const updatedItems = [...items];
            updatedItems[index].quantity = value || 1;
            setItems(updatedItems);
          }}
        />
      ),
    },
    {
      title: 'Satuan',
      dataIndex: 'unit',
      key: 'unit',
      render: (_: any, _record: PurchaseRequestItem, index: number) => (
        <Input
          placeholder="Satuan"
          onChange={(e) => {
            const updatedItems = [...items];
            updatedItems[index].unit = e.target.value;
            setItems(updatedItems);
          }}
        />
      ),
    },
    {
      title: 'Catatan',
      dataIndex: 'notes',
      key: 'notes',
      render: (_: any, _record: PurchaseRequestItem, index: number) => (
        <Input
          placeholder="Catatan"
          onChange={(e) => {
            const updatedItems = [...items];
            updatedItems[index].notes = e.target.value;
            setItems(updatedItems);
          }}
        />
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: PurchaseRequestItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
        />
      ),
    },
  ];

  return (
    <Card title="Form Purchase Request">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="branchId"
          label="Cabang"
          rules={[{ required: true, message: 'Cabang harus diisi' }]}
        >
          <Select
            loading={branchLoading}
            placeholder="Pilih Cabang"
          >
            {branches.map(branch => (
              <Option key={branch.id} value={branch.id}>{branch.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="warehouseId"
          label="Gudang"
          rules={[{ required: true, message: 'Gudang harus diisi' }]}
        >
          <Select
            loading={loadingwarehous}
            placeholder="Pilih Gudang"
          >
            {warehouses.map(b => (
              <Option key={b.id} value={b.id}>{b.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="requestDate"
          label="Tanggal Request"
          rules={[{ required: true, message: 'Tanggal request harus diisi' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="department"
          label="Departemen"
          rules={[{ required: true, message: 'Departemen harus diisi' }]}
        >
          <Select
            loading={loading}
            placeholder="Pilih Departemen"
          >
            {departments.map(dept => (
              <Option key={dept.id} value={dept.name}>{dept.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="notes"
          label="Catatan"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Card title="Item Request" extra={<Button type="primary" icon={<PlusOutlined />} onClick={addItem}>Tambah Item</Button>}>
          <Table columns={columns} dataSource={items} rowKey="id" pagination={false} />
        </Card>

        <Form.Item style={{ marginTop: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Simpan
            </Button>
            <Button icon={<RollbackOutlined />} onClick={() => navigate('/purchase/request')}>
              Kembali
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}; 