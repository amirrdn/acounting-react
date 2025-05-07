import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Table, Select, InputNumber, message } from 'antd';
import { purchaseOrderService } from '@/api/purchase/order.api';
import { productService } from '@/api/product/product.api';
import { PurchaseOrder } from '@/types/purchase.types';
import { Product } from '@/types/product.types';
import dayjs from 'dayjs';

interface PurchaseReceiptFormProps {
  onFinish: (values: any) => void;
  initialValues?: any;
  isEdit?: boolean;
  form?: any;
}

export const PurchaseReceiptForm: React.FC<PurchaseReceiptFormProps> = ({ 
  onFinish, 
  initialValues,
  isEdit = false,
  form
}) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialValues && form) {
      const parsedDate = dayjs(initialValues.receiptDate);
      const formValues = {
        ...initialValues,
        receiptDate: parsedDate.isValid() ? parsedDate : undefined,
        items: (initialValues.items || []).map((item: any) => ({
          ...item,
          productId: item.product?.id,
          productName: item.product?.name,
          unitPrice: Number(item.unitPrice || 0),
          quantity: Number(item.quantity || 0),
          subtotal: Number(item.subtotal || 0)
        }))
      };
      form.setFieldsValue(formValues);
      if (initialValues.purchaseOrder) {
        initialValues.purchaseOrder = {
          ...initialValues.purchaseOrder,
          items: initialValues.items || []
        };
        setSelectedOrder(initialValues.purchaseOrder);
      }
    }
  }, [initialValues, form]);
  

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const data = await purchaseOrderService.getAll();
      if (Array.isArray(data)) {
        setPurchaseOrders(data);
      } else {
        message.error('Format data purchase order tidak valid');
        setPurchaseOrders([]);
      }
    } catch (error) {
      message.error('Gagal mengambil data purchase order');
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
        message.error('Format data produk tidak valid');
      }
    } catch (error) {
      message.error('Gagal mengambil data produk');
      setProducts([]);
    }
  };

  const handleOrderSelect = (orderId: string) => {
    const order = purchaseOrders.find(o => o.id === orderId);
    setSelectedOrder(order || null);
    
    if (order) {
      form.setFieldsValue({
        items: order.items?.map((item: any) => ({
          productId: item.product?.id,
          productName: item.product?.name,
          unitPrice: Number(item.unitPrice || 0),
          quantity: Number(item.quantity || 0),
          subtotal: Number(item.subtotal || 0)
        })) || []
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const dataToSend = {
        ...values,
        branchId: selectedOrder?.branch.id,
        items: values.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };
      await onFinish(dataToSend);
    } catch (error) {
      message.error('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: any) => (
        <Form.Item
          name={['items', record.key, 'productId']}
          rules={[{ required: true, message: 'Pilih produk' }]}
        >
          <Select
            placeholder="Pilih produk"
            disabled={isEdit}
            onChange={(value) => {
              const product = products.find(p => p.id === value);
              if (product) {
                form.setFieldsValue({
                  items: {
                    [record.key]: {
                      productName: product.name,
                      unitPrice: product.price
                    }
                  }
                });
              }
            }}
          >
            {products.map(product => (
              <Select.Option key={product.id} value={product.id}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'Harga',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (_: any, record: any) => (
        <Form.Item
          name={['items', record.key, 'unitPrice']}
          rules={[{ required: true, message: 'Masukkan harga' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/Rp\s?|(,*)/g, '')}
            disabled={isEdit}
          />
        </Form.Item>
      )
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: any) => (
        <Form.Item
          name={['items', record.key, 'quantity']}
          rules={[{ required: true, message: 'Masukkan jumlah' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            disabled={isEdit}
            onChange={(value) => {
              const unitPrice = form.getFieldValue(['items', record.key, 'unitPrice']);
              if (unitPrice && value) {
                form.setFieldsValue({
                  items: {
                    [record.key]: {
                      subtotal: unitPrice * value
                    }
                  }
                });
              }
            }}
          />
        </Form.Item>
      )
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (_: any, record: any) => (
        <Form.Item
          name={['items', record.key, 'subtotal']}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/Rp\s?|(,*)/g, '')}
            disabled
          />
        </Form.Item>
      )
    }
  ];

  return (
      <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      >
        <Form.Item
          name="purchaseOrderId"
          label="Purchase Order"
          rules={[{ required: true, message: 'Pilih purchase order' }]}
        >
          {isEdit ? (
            <p>{selectedOrder?.poNumber}</p>
          ) : (
            <Select
              placeholder="Pilih purchase order"
              onChange={handleOrderSelect}
              disabled={isEdit}
              loading={loading}
            >
              {Array.isArray(purchaseOrders) && purchaseOrders.map(order => (
                <Select.Option key={order.id} value={order.id}>
                  {order.poNumber} - {order.supplier?.name || 'Unknown Supplier'}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          name="receiptDate"
          label="Tanggal Pembelian"
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined
          })}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Catatan"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Table
          columns={columns}
          dataSource={selectedOrder?.items?.map((item: any, index: number) => ({
            key: index,
            ...item
          })) || []}
          pagination={false}
        />

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? 'Update' : 'Simpan'}
          </Button>
        </Form.Item>
      </Form>
  );
}; 