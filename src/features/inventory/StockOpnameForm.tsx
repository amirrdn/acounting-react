import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Table, Card, message } from 'antd';
import { Warehouse, Product } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';
import { warehouseApi } from '../../api/warehouse/warehouseApi';
import { productService } from '../../api/product/product.api';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface StockOpnameRequest {
  warehouseId: number;
  items: {
    productId: number;
    actualQty: number;
  }[];
}

const StockOpnameForm: React.FC = () => {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [warehouseId, setWarehouseId] = useState<string>('');
  const navigate = useNavigate();

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
      actualQty: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (key: number) => {
    setItems(items.filter(item => item.key !== key));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const stockOpnameData: StockOpnameRequest = {
        warehouseId: Number(warehouseId),
        items: items.map(item => ({
          productId: Number(item.productId),
          actualQty: Number(item.actualQty)
        }))
      };

      await inventoryService.createStockOpname(stockOpnameData);
      message.success('Stock opname berhasil dibuat');
      form.resetFields();
      setItems([]);
      navigate('/inventory/stock-opname');
    } catch (error) {
      console.error('Error creating stock opname:', error);
      message.error('Gagal membuat stock opname');
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
      title: 'Kuantitas Aktual',
      dataIndex: 'actualQty',
      key: 'actualQty',
      render: (_: any, record: any) => (
        <Input
          type="number"
          onChange={(e) => {
            const newItems = items.map(item =>
              item.key === record.key ? { ...item, actualQty: parseInt(e.target.value) } : item
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
    <Card title="Form Stock Opname" style={{ margin: '20px' }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="warehouse"
          label="Gudang"
          rules={[{ required: true, message: 'Pilih gudang' }]}
        >
          <Select placeholder="Pilih Gudang" onChange={(value) => setWarehouseId(value)}>
            {warehouses.map(warehouse => (
              <Option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </Option>
            ))}
          </Select>
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

export default StockOpnameForm; 