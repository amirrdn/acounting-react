import React from 'react';
import { Form, Input, Select, Button, message, DatePicker, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { accountService, Account } from '@/api/account/account.api';
import { cashBankService } from '@/api/cash-bank/cash-bank.api';
import { branchService, Branch } from '@/api/branch/branch.api';
import dayjs from 'dayjs';

export const CashInForm: React.FC = () => {
  const [form] = Form.useForm();

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await accountService.getAll();
      return response.data;
    },
  });

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await branchService.getAll();
      return response;
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      await cashBankService.cashIn({
        accountId: values.accountId,
        destinationAccountId: values.destinationAccountId,
        amount: values.amount,
        description: values.description,
        branchId: values.branchId,
        date: values.date ? dayjs(values.date).toDate() : undefined,
      });
      message.success('Kas masuk berhasil ditambahkan');
      form.resetFields();
    } catch (error) {
      message.error('Gagal menambahkan kas masuk');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="branchId"
            label="Cabang"
            rules={[{ required: true, message: 'Pilih cabang' }]}
          >
            <Select placeholder="Pilih cabang" style={{ width: '100%' }}>
              {branches?.map((branch: Branch) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="date"
            label="Tanggal"
            rules={[{ required: true, message: 'Pilih tanggal' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="accountId"
            label="Akun Sumber"
            rules={[{ required: true, message: 'Pilih akun sumber' }]}
          >
            <Select placeholder="Pilih akun sumber" style={{ width: '100%' }}>
              {accounts?.map((account: Account) => (
                <Select.Option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="destinationAccountId"
            label="Akun Tujuan"
            rules={[{ required: true, message: 'Pilih akun tujuan' }]}
          >
            <Select placeholder="Pilih akun tujuan" style={{ width: '100%' }}>
              {accounts?.map((account: Account) => (
                <Select.Option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="amount"
            label="Jumlah"
            rules={[{ required: true, message: 'Masukkan jumlah' }]}
          >
            <Input type="number" placeholder="Masukkan jumlah" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="description"
            label="Keterangan"
            rules={[{ required: true, message: 'Masukkan keterangan' }]}
          >
            <Input.TextArea placeholder="Masukkan keterangan" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Simpan
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}; 