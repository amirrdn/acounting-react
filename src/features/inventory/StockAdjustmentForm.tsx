import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Table, Card, message } from 'antd';
import { Warehouse, Product } from '../../types/inventory';
import { inventoryService } from '../../api/inventory';
import { warehouseApi } from '../../api/warehouse/warehouseApi';
import { productService } from '../../api/product/product.api';
import { useAuth } from '../../hooks/useAuth';


const { Option } = Select;
const { TextArea } = Input;

interface StockAdjustmentRequest {
  productId: number;
  actualQty: number;
  reason: string;
  userId: number;
}

const StockAdjustmentForm: React.FC = () => {
  const { user } = useAuth();
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
      product: null,
      quantity: 0,
      type: 'IN',
      reason: '',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (key: number) => {
    setItems(items.filter(item => item.key !== key));
  };

  const handleSubmit = async (_values: any) => {
    try {
      setLoading(true);

      for (const item of items) {
        if (!item.product || !item.quantity || !item.reason) {
          message.error('Semua field harus diisi');
          return;
        }

        const stockAdjustmentData: StockAdjustmentRequest = {
          productId: item.product,
          actualQty: item.quantity,
          reason: item.reason,
          userId: user?.id || 0
        };

        const response = await inventoryService.createStockAdjustment(stockAdjustmentData);
        
        if (response.message === "No adjustment needed") {
          message.info('Tidak ada penyesuaian yang diperlukan karena stok sudah sesuai');
        } else {
          message.success(`Penyesuaian stok berhasil: ${response.message}. Selisih: ${response.difference}`);
        }
      }

      form.resetFields();
      setItems([]);
    } catch (error) {
      console.error('Error creating stock adjustment:', error);
      message.error('Gagal membuat penyesuaian stok');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, record: any) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Pilih Produk"
          onChange={(value) => {
            const newItems = items.map(item =>
              item.key === record.key ? { ...item, product: value } : item
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
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      render: (_: any, record: any) => (
        <Select
          style={{ width: '100%' }}
          value={record.type}
          onChange={(value) => {
            const newItems = items.map(item =>
              item.key === record.key ? { ...item, type: value } : item
            );
            setItems(newItems);
          }}
        >
          <Option value="IN">Penambahan</Option>
          <Option value="OUT">Pengurangan</Option>
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
          value={record.quantity}
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
      title: 'Alasan',
      dataIndex: 'reason',
      key: 'reason',
      render: (_: any, record: any) => (
        <TextArea
          rows={2}
          value={record.reason}
          onChange={(e) => {
            const newItems = items.map(item =>
              item.key === record.key ? { ...item, reason: e.target.value } : item
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
    <Card title="Form Penyesuaian Stok" style={{ margin: '20px' }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="warehouse"
          label="Gudang"
          rules={[{ required: true, message: 'Pilih gudang' }]}
        >
          <Select placeholder="Pilih Gudang">
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

export default StockAdjustmentForm; 