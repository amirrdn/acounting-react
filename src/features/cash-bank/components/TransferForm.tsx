import React from 'react';
import { Form, Input, Select, Button, message, DatePicker } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/api/account/account.api';
import { cashBankService } from '@/api/cash-bank/cash-bank.api';
import { branchService, Branch } from '@/api/branch/branch.api';
import { Account } from '@/types/Account';
import dayjs from 'dayjs';

export const TransferForm: React.FC = () => {
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
      await cashBankService.transfer({
        sourceId: values.sourceId,
        destinationAccountId: values.destId,
        amount: values.amount,
        description: values.description,
        branchId: values.branchId,
        date: values.date ? dayjs(values.date).toDate() : undefined,
      });
      message.success('Transfer berhasil dilakukan');
      form.resetFields();
    } catch (error: any) {
      if (error.message === 'Saldo tidak cukup untuk transfer') {
        message.error('Saldo tidak cukup untuk melakukan transfer');
      } else if (error.message === 'Akun sumber dan tujuan tidak boleh sama') {
        message.error('Akun sumber dan tujuan tidak boleh sama');
      } else {
        message.error('Gagal melakukan transfer');
      }
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="branchId"
        label="Cabang"
        rules={[{ required: true, message: 'Pilih cabang' }]}
      >
        <Select placeholder="Pilih cabang">
          {branches?.map((branch: Branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Tanggal"
        rules={[{ required: true, message: 'Pilih tanggal' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="sourceId"
        label="Akun Sumber"
        rules={[{ required: true, message: 'Pilih akun sumber' }]}
      >
        <Select placeholder="Pilih akun sumber">
          {accounts?.map((account: Account) => (
            <Select.Option key={account.id} value={account.id}>
              {account.code} - {account.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="destId"
        label="Akun Tujuan"
        rules={[{ required: true, message: 'Pilih akun tujuan' }]}
      >
        <Select placeholder="Pilih akun tujuan">
          {accounts?.map((account: Account) => (
            <Select.Option key={account.id} value={account.id}>
              {account.code} - {account.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="Jumlah"
        rules={[{ required: true, message: 'Masukkan jumlah' }]}
      >
        <Input type="number" placeholder="Masukkan jumlah" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Keterangan"
        rules={[{ required: true, message: 'Masukkan keterangan' }]}
      >
        <Input.TextArea placeholder="Masukkan keterangan" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Simpan
        </Button>
      </Form.Item>
    </Form>
  );
}; 