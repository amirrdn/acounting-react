import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col, Table, InputNumber, message, Switch, Upload, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PurchaseOrder } from '@/types/purchase.types';
import { purchaseOrderService } from '@/api/purchase/order.api';
import { supplierService } from '@/api/supplier';
import { branchService } from '@/api/branch';
import { productService } from '@/api/product';
import { purchaseRequestService } from '@/api/purchase/request.api';
import { Supplier } from '@/types/supplier.types';
import { Branch } from '@/types/branch.types';
import { Product } from '@/types/Product';
import dayjs from 'dayjs';

const { Option } = Select;

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder;
  requestId?: string;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ purchaseOrder, requestId }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [suppliersData, branchesData, productsData] = await Promise.all([
          supplierService.getAll(),
          branchService.getAll(),
          productService.getAll()
        ]);
        setSuppliers(suppliersData.map((s: Supplier) => ({ id: s.id, name: s.name })));
        setBranches(branchesData.map((b: Branch) => ({ id: b.id, name: b.name })));
        setProducts(Array.isArray(productsData) ? productsData : productsData?.data || []);

        if (purchaseOrder) {
          const initialItems = purchaseOrder.items ? purchaseOrder.items.map(item => ({
            productId: item.product?.id || null,
            quantity: item.quantity || 1,
            unit: item.unit || '',
            price: item.unitPrice || 0
          })) : [];

          form.setFieldsValue({
            supplierId: purchaseOrder.supplier?.id,
            branchId: purchaseOrder.branch?.id,
            orderDate: purchaseOrder.orderDate ? dayjs(purchaseOrder.orderDate) : undefined,
            expectedDeliveryDate: purchaseOrder.expectedDeliveryDate ? dayjs(purchaseOrder.expectedDeliveryDate) : undefined,
            isPpn: purchaseOrder.isPpn || false,
            ppnRate: purchaseOrder.ppnRate || 11,
            isPph: purchaseOrder.isPph || false,
            pphRate: purchaseOrder.pphRate || 0,
            notes: purchaseOrder.notes || '',
            items: initialItems
          });
          setItems(initialItems);
        } else if (requestId) {
          const request = await purchaseRequestService.getById(requestId);
          const initialItems = request.items ? request.items.map((item: { product?: { id: number }; quantity: number; unit: string; unitPrice: number }) => ({
            productId: item.product?.id || null,
            quantity: item.quantity || 1,
            unit: item.unit || '',
            price: item.unitPrice || 0
          })) : [];

          form.setFieldsValue({
            branchId: request.branch?.id,
            orderDate: dayjs(),
            expectedDeliveryDate: dayjs().add(7, 'days'),
            isPpn: false,
            ppnRate: 11,
            isPph: false,
            pphRate: 0,
            notes: request.notes || '',
            items: initialItems
          });
          setItems(initialItems);
        }
      } catch (error) {
        message.error('Gagal mengambil data: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, purchaseOrder, requestId]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));
      
      if (fileList.length > 0) {
        formData.append('file', fileList[0].originFileObj);
      }

      if (purchaseOrder) {
        await purchaseOrderService.update(purchaseOrder.id, formData);
        message.success('Purchase Order berhasil diperbarui');
      } else {
        await purchaseOrderService.create(formData);
        message.success('Purchase Order berhasil dibuat');
      }
      
      navigate('/purchase/orders');
    } catch (error) {
      message.error('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const addItem = () => {
    const newItems = [...items, { productId: null, quantity: 1, unit: '', price: 0 }];
    setItems(newItems);
    form.setFieldsValue({ items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    form.setFieldsValue({ items: newItems });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        isPpn: false,
        ppnRate: 11,
        isPph: false,
        pphRate: 0,
        items: []
      }}
    >
      <Card title="Supplier & Cabang" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="supplierId"
              label="Supplier"
              rules={[{ required: true, message: 'Pilih supplier' }]}
            >
              <Select placeholder="Pilih supplier" loading={loading}>
                {suppliers.map(supplier => (
                  <Option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="branchId"
              label="Cabang"
              rules={[{ required: true, message: 'Pilih cabang' }]}
            >
              <Select placeholder="Pilih cabang" loading={loading}>
                {branches.map(branch => (
                  <Option key={branch.id} value={branch.id}>
                    {branch.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Tanggal" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="orderDate"
              label="Tanggal Order"
              rules={[{ required: true, message: 'Pilih tanggal order' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="expectedDeliveryDate"
              label="Tanggal Pengiriman"
              rules={[{ required: true, message: 'Pilih tanggal pengiriman' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="PPN" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="isPpn"
              label="PPN"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ppnRate"
              label="Tarif PPN (%)"
              rules={[{ required: true, message: 'Masukkan tarif PPN' }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="PPh" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="isPph"
              label="PPh"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="pphRate"
              label="Tarif PPh (%)"
              rules={[{ required: true, message: 'Masukkan tarif PPh' }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Item Pembelian" style={{ marginBottom: 24 }}>
        <Form.Item
          name="items"
          label="Item"
          rules={[{ required: true, message: 'Tambahkan minimal satu item' }]}
        >
          <Table
            columns={[
              {
                title: 'Produk',
                dataIndex: 'productId',
                key: 'productId',
                render: (_, __, index) => (
                  <Form.Item
                    name={['items', index, 'productId']}
                    rules={[{ required: true, message: 'Pilih produk' }]}
                  >
                    <Select 
                      placeholder="Pilih produk"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: string, option: any) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {products.map(product => (
                        <Select.Option key={product.id} value={product.id} label={product.name}>
                          {product.name} - {product.code}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ),
              },
              {
                title: 'Jumlah',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (_, _record, index) => (
                  <Form.Item
                    name={['items', index, 'quantity']}
                    rules={[{ required: true, message: 'Masukkan jumlah' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                ),
              },
              {
                title: 'Satuan',
                dataIndex: 'unit',
                key: 'unit',
                render: (_, __, index) => (
                  <Form.Item
                    name={['items', index, 'unit']}
                    rules={[{ required: true, message: 'Masukkan satuan' }]}
                  >
                    <Input />
                  </Form.Item>
                ),
              },
              {
                title: 'Harga',
                dataIndex: 'price',
                key: 'price',
                render: (_, __, index) => (
                  <Form.Item
                    name={['items', index, 'price']}
                    rules={[{ required: true, message: 'Masukkan harga' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                ),
              },
              {
                title: 'Aksi',
                key: 'action',
                render: (_, __, index) => (
                  <Button type="link" danger onClick={() => removeItem(index)}>
                    Hapus
                  </Button>
                ),
              },
            ]}
            dataSource={items}
            pagination={false}
            footer={() => (
              <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>
                Tambah Item
              </Button>
            )}
          />
        </Form.Item>
      </Card>

      <Card title="Lampiran" style={{ marginBottom: 24 }}>
        <Form.Item
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </Form.Item>
      </Card>

      <Card title="Catatan" style={{ marginBottom: 24 }}>
        <Form.Item
          name="notes"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {purchaseOrder ? 'Update' : 'Simpan'}
        </Button>
      </Form.Item>
    </Form>
  );
}; 