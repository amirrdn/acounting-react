import React, { useEffect } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { SupplierFormData } from '../../types/supplier';
import { supplierService } from '@/api/supplier';

const SupplierForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const supplierId = id ? parseInt(id) : undefined;

  useEffect(() => {
    const fetchSupplier = async () => {
      if (supplierId) {
        try {
          const supplier = await supplierService.getById(supplierId.toString());
          form.setFieldsValue(supplier);
        } catch (error) {
          message.error('Gagal memuat data supplier');
        }
      }
    };

    fetchSupplier();
  }, [supplierId, form]);

  const handleSubmit = async (values: SupplierFormData) => {
    try {
      if (supplierId) {
        await supplierService.update(supplierId.toString(), values);
        message.success('Supplier berhasil diperbarui');
      } else {
        const createData = {
          ...values,
          code: `SUP-${Date.now()}`
        };
        await supplierService.create(createData);
        message.success('Supplier berhasil ditambahkan');
      }
      form.resetFields();
    } catch (error) {
      message.error('Gagal menyimpan data supplier');
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {supplierId ? 'Edit Supplier' : 'Tambah Supplier Baru'}
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Kode Supplier"
              rules={[{ required: true, message: 'Kode supplier wajib diisi' }]}
            >
              <Input disabled placeholder="Kode akan digenerate otomatis" />
            </Form.Item>
          </Col>
          <Col span={12}>
        <Form.Item
          name="name"
              label="Nama Supplier"
              rules={[{ required: true, message: 'Nama supplier wajib diisi' }]}
        >
              <Input placeholder="Masukkan nama supplier" />
        </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
        <Form.Item 
          name="email" 
          label="Email"
              rules={[
                { type: 'email', message: 'Format email tidak valid' }
              ]}
        >
              <Input placeholder="Masukkan email supplier" />
        </Form.Item>
          </Col>
          <Col span={12}>
        <Form.Item 
          name="phone" 
              label="Nomor Telepon"
              rules={[
                { pattern: /^[0-9+\-\s()]*$/, message: 'Format nomor telepon tidak valid' }
              ]}
        >
              <Input placeholder="Masukkan nomor telepon" />
        </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          name="address" 
          label="Alamat"
          rules={[{ required: true, message: 'Alamat wajib diisi' }]}
        >
          <Input.TextArea 
            rows={3}
            placeholder="Masukkan alamat lengkap supplier"
          />
        </Form.Item>

        <Form.Item 
          name="npwp" 
          label="NPWP"
          rules={[
            { pattern: /^[0-9.]*$/, message: 'Format NPWP tidak valid' }
          ]}
        >
          <Input placeholder="Masukkan nomor NPWP" />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            {supplierId ? 'Perbarui' : 'Simpan'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SupplierForm;
