import React from 'react';
import { Card, Form } from 'antd';
import { PurchaseReceiptForm } from './PurchaseReceiptForm';
import { purchaseReceiptService } from '@/api/purchase/receipt.api';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export const PurchaseReceiptCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await purchaseReceiptService.create(values);
      message.success('Receipt berhasil dibuat');
      navigate('/purchase/receipts');
    } catch (error) {
      message.error('Gagal membuat receipt');
    }
  };

  return (
    <Card title="Buat Purchase Receipt">
      <PurchaseReceiptForm 
        onFinish={handleSubmit}
        isEdit={false}
        form={form}
      />
    </Card>
  );
}; 