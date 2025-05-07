import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, Card, Select, Switch, Space, Table, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { purchaseInvoiceService, PurchaseInvoiceItem, CreatePurchaseInvoiceDto } from '@/api/purchase/invoice.api';
import { supplierService } from '@/api/supplier';
import { productService } from '@/api/product';
import { branchService } from '@/api/branch';
import { accountService } from '@/api/account';

interface PurchaseInvoiceFormProps {
  mode: 'create' | 'edit';
}

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  parent: any;
}

interface AccountResponse {
  status: string;
  data: Account[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const PurchaseInvoiceForm: React.FC<PurchaseInvoiceFormProps> = ({ mode }) => {
  
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState<PurchaseInvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountPage, setAccountPage] = useState(1);
  const [accountHasMore, setAccountHasMore] = useState(true);
  const [accountSearch, setAccountSearch] = useState('');


  useEffect(() => {
    try {
      fetchSuppliers();
      fetchProducts();
      fetchBranches();
      fetchAccounts();
      if (mode === 'edit' && id) {
        fetchInvoice();
      }
    } catch (error) {
      message.error('Gagal mengambil data: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    }
  }, [mode, id]);

  const fetchSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      message.error('Gagal mengambil data supplier: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.data);
    } catch (error) {
      message.error('Gagal mengambil data produk: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error) {
      message.error('Gagal mengambil data cabang: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    }
  };

  const fetchAccounts = async (page = 1, search = '') => {
    try {
      setAccountLoading(true);
      const response = await accountService.getAll({ type: [search] });
      const accountResponse = response as AccountResponse;
      
      if (page === 1) {
        setAccounts(accountResponse.data);
      } else {
        setAccounts(prev => [...prev, ...accountResponse.data]);
      }
      
      setAccountHasMore(accountResponse.meta.page < accountResponse.meta.totalPages);
      setAccountPage(accountResponse.meta.page);
    } catch (error) {
      message.error('Gagal mengambil data akun: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setAccountLoading(false);
    }
  };

  const handleAccountSearch = (value: string) => {
    setAccountSearch(value);
    setAccountPage(1);
    fetchAccounts(1, value);
  };

  const handleAccountScroll = (e: any) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight && !accountLoading && accountHasMore) {
      fetchAccounts(accountPage + 1, accountSearch);
    }
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const data = await purchaseInvoiceService.getById(id!);
      form.setFieldsValue({
        ...data,
        invoiceDate: dayjs(data.invoiceDate),
        dueDate: dayjs(data.dueDate),
        supplierId: data.supplier.id,
        branchId: data.branch.id,
        payableAccountId: data.payableAccount.id
      });
      setItems(data.items);
    } catch (error) {
      message.error('Gagal mengambil data invoice: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const updatedItems = items.map(item => ({
        ...item,
        subtotal: item.quantity * item.unitPrice,
        total: (item.quantity * item.unitPrice) - item.discount
      }));
      
      const formData: CreatePurchaseInvoiceDto = {
        ...values,
        invoiceDate: values.invoiceDate.format('YYYY-MM-DD'),
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        items: updatedItems,
        subtotal: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
        taxAmount: updatedItems.reduce((sum, item) => sum + item.taxAmount, 0),
        totalAmount: updatedItems.reduce((sum, item) => sum + item.total, 0)
      };

      if (mode === 'create') {
        await purchaseInvoiceService.create(formData);
        message.success('Invoice berhasil dibuat');
      } else {
        await purchaseInvoiceService.update(id!, formData);
        message.success('Invoice berhasil diupdate');
      }
      navigate('/purchases/invoices');
    } catch (error) {
      message.error('Gagal menyimpan invoice: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'productId',
      key: 'productId',
      render: (_: any, record: PurchaseInvoiceItem, index: number) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Pilih Produk"
          value={record.id}
          onChange={(value) => {
            const newItems = [...items];
            newItems[index].id = value;
            setItems(newItems);
          }}
        >
          {Array.isArray(products) && products.map(product => (
            <Select.Option key={product.id} value={product.id}>
              {product.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: PurchaseInvoiceItem, index: number) => (
        <InputNumber
          min={0}
          value={record.quantity}
          onBlur={(e) => {
            const newItems = [...items];
            newItems[index].quantity = parseFloat(e.target.value) || 0;
            newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
            newItems[index].total = newItems[index].subtotal - newItems[index].discount;
            setItems(newItems);
          }}
        />
      ),
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (_: any, record: PurchaseInvoiceItem, index: number) => (
        <InputNumber
          min={0}
          value={record.unitPrice}
          onBlur={(e) => {
            const newItems = [...items];
            newItems[index].unitPrice = parseFloat(e.target.value) || 0;
            newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
            newItems[index].total = newItems[index].subtotal - newItems[index].discount;
            setItems(newItems);
          }}
        />
      ),
    },
    {
      title: 'Diskon',
      dataIndex: 'discount',
      key: 'discount',
      render: (_: any, record: PurchaseInvoiceItem, index: number) => (
        <InputNumber
          min={0}
          value={record.discount}
          onBlur={(e) => {
            const newItems = [...items];
            newItems[index].discount = parseFloat(e.target.value) || 0;
            newItems[index].total = newItems[index].subtotal - newItems[index].discount;
            setItems(newItems);
          }}
        />
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (_: any, record: PurchaseInvoiceItem) => 
        `Rp ${(record.quantity * record.unitPrice).toLocaleString('id-ID')}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (_: any, record: PurchaseInvoiceItem) => 
        `Rp ${((record.quantity * record.unitPrice) - record.discount).toLocaleString('id-ID')}`,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, __: any, index: number) => (
        <Button 
          type="link" 
          danger 
          onClick={() => {
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
          }}
        >
          Hapus
        </Button>
      ),
    },
  ];

  return (
    <Card title={mode === 'create' ? 'Buat Invoice Pembelian' : 'Edit Invoice Pembelian'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          invoiceDate: dayjs(),
          dueDate: dayjs().add(30, 'days'),
          isPpn: false,
          isPph: false,
        }}
      >
        <Form.Item
          name="invoiceDate"
          label="Tanggal Invoice"
          rules={[{ required: true, message: 'Tanggal invoice harus diisi' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Tanggal Jatuh Tempo"
          rules={[{ required: true, message: 'Tanggal jatuh tempo harus diisi' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="supplierId"
          label="Supplier"
          rules={[{ required: true, message: 'Supplier harus dipilih' }]}
        >
          <Select placeholder="Pilih Supplier">
            {suppliers.map(supplier => (
              <Select.Option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="branchId"
          label="Cabang"
          rules={[{ required: true, message: 'Cabang harus dipilih' }]}
        >
          <Select placeholder="Pilih Cabang">
            {branches.map(branch => (
              <Select.Option key={branch.id} value={branch.id}>
                {branch.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="payableAccountId"
          label="Akun Hutang"
          rules={[{ required: true, message: 'Akun hutang harus dipilih' }]}
        >
          <Select
            showSearch
            placeholder="Pilih akun hutang"
            optionFilterProp="children"
            onSearch={handleAccountSearch}
            onPopupScroll={handleAccountScroll}
            loading={accountLoading}
            filterOption={false}
          >
            {accounts.map(account => (
              <Select.Option key={account.id} value={account.id}>
                {account.code} - {account.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Item">
          <Button 
            type="dashed" 
            onClick={() => setItems([...items, {
              productId: '',
              quantity: 0,
              unitPrice: 0,
              discount: 0,
              subtotal: 0,
              taxAmount: 0,
              total: 0
            }])}
            style={{ width: '100%' }}
          >
            Tambah Item
          </Button>
          <Table 
            columns={columns} 
            dataSource={items}
            rowKey={(record) => record.id || Math.random().toString()}
            pagination={false}
          />
        </Form.Item>

        <Form.Item name="isPpn" valuePropName="checked">
          <Switch checkedChildren="PPN" unCheckedChildren="Tanpa PPN" />
        </Form.Item>

        <Form.Item name="isPph" valuePropName="checked">
          <Switch checkedChildren="PPh" unCheckedChildren="Tanpa PPh" />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.isPpn !== currentValues.isPpn}
        >
          {({ getFieldValue }) => getFieldValue('isPpn') ? (
            <Form.Item
              name="ppnRate"
              label="Tarif PPN (%)"
              rules={[{ required: true, message: 'Tarif PPN harus diisi' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} max={100} />
            </Form.Item>
          ) : null}
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.isPph !== currentValues.isPph}
        >
          {({ getFieldValue }) => getFieldValue('isPph') ? (
            <Form.Item
              name="pphRate"
              label="Tarif PPh (%)"
              rules={[{ required: true, message: 'Tarif PPh harus diisi' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} max={100} />
            </Form.Item>
          ) : null}
        </Form.Item>

        <Form.Item name="notes" label="Catatan">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Simpan' : 'Update'}
            </Button>
            <Button onClick={() => navigate('/purchases/invoices')}>
              Batal
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}; 