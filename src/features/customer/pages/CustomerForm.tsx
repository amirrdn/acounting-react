import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import Card from 'antd/es/card';
import { Customer, CreateCustomerDto } from '@/api/customer/customer.api';
import { customerService } from '@/api/customer/customer.api';

const CustomerForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const fetchCustomer = useCallback(async () => {
    try {
      if (!id) return;
      const data = await customerService.getById(id);
      form.setFieldsValue(data);
    } catch (error) {
      message.error('Gagal mengambil data pelanggan: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    }
  }, [id, form]);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id, fetchCustomer]);

  const onFinish = async (values: Partial<Customer>) => {
    setLoading(true);
    try {
      const customerData: CreateCustomerDto = {
        ...values,
        code: values.code || '',
        name: values.name || '',
        isActive: values.isActive ?? true
      };

      if (id) {
        await customerService.update(id, customerData);
        message.success('Pelanggan berhasil diperbarui');
      } else {
        await customerService.create(customerData);
        message.success('Pelanggan berhasil dibuat');
      }
      navigate('/customers');
    } catch (error) {
      message.error('Gagal menyimpan pelanggan: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title={id ? 'Edit Customer' : 'Tambah Customer Baru'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama wajib diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telepon"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Alamat"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="npwp"
            label="NPWP"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => navigate('/customers')}>
                Batal
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {id ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerForm; 