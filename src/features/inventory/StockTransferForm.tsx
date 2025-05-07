import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Table, Card, message, DatePicker } from 'antd';
import { Warehouse, Product } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';
import { warehouseApi } from '../../api/warehouse/warehouseApi';
import { productService } from '../../api/product/product.api';
import dayjs from 'dayjs';

const { Option } = Select;

const StockTransferForm: React.FC = () => {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehousesData, productsData] = await Promise.all([
          warehouseApi.getAll(),
          productService.getProducts()
        ]);
        setWarehouses(warehousesData.data);
        setProducts(productsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Gagal mengambil data gudang dan produk');
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    const newItem = {
      key: Date.now(),
      productId: null,
      quantity: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (key: number) => {
    setItems(items.filter(item => item.key !== key));
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const stockTransferData = {
        fromWarehouseId: values.fromWarehouse,
        toWarehouseId: values.toWarehouse,
        transferDate: values.transferDate.format('YYYY-MM-DD'),
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await inventoryService.createStockTransfer(stockTransferData);
      message.success('Transfer stok berhasil dibuat');
      form.resetFields();
      setItems([]);
    } catch (error) {
      console.error('Error creating stock transfer:', error);
      message.error('Gagal membuat transfer stok');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'productId',
      key: 'productId',
      render: (_: any, record: any) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Pilih Produk"
          onChange={(value) => {
            const newItems = items.map(item =>
              item.key === record.key ? { ...item, productId: value } : item
            );
            setItems(newItems);
          }}
        >
          {products.map(product => (
            <Option key={product.id} value={product.id}>
              {product.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Kuantitas',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: any) => (
        <Input
          type="number"
          onChange={(e) => {
            const newItems = items.map(item =>
              item.key === record.key ? { ...item, quantity: parseInt(e.target.value) } : item
            );
            setItems(newItems);
          }}
        />
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleRemoveItem(record.key)}>
          Hapus
        </Button>
      ),
    },
  ];

  return (
    <Card title="Form Transfer Stok" style={{ margin: '20px' }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="fromWarehouse"
          label="Dari Gudang"
          rules={[{ required: true, message: 'Pilih gudang asal' }]}
        >
          <Select placeholder="Pilih Gudang Asal">
            {warehouses.map(warehouse => (
              <Option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="toWarehouse"
          label="Ke Gudang"
          rules={[{ required: true, message: 'Pilih gudang tujuan' }]}
        >
          <Select placeholder="Pilih Gudang Tujuan">
            {warehouses.map(warehouse => (
              <Option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="transferDate"
          label="Tanggal Transfer"
          rules={[{ required: true, message: 'Pilih tanggal transfer' }]}
        >
          <DatePicker style={{ width: '100%' }} defaultValue={dayjs()} />
        </Form.Item>

        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          footer={() => (
            <Button type="dashed" onClick={handleAddItem} block>
              Tambah Item
            </Button>
          )}
        />

        <Form.Item style={{ marginTop: '20px' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StockTransferForm; 