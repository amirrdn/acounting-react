import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, message, Spin } from 'antd';
import { PurchaseReceiptForm } from './PurchaseReceiptForm';
import { purchaseReceiptService } from '@/api/purchase/receipt.api';
import { PurchaseReceipt } from '@/types/purchase.types';
import dayjs from 'dayjs';

export const PurchaseReceiptEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const data = await purchaseReceiptService.getById(id!);
      setReceipt(data);
      
      form.setFieldsValue({
        ...data,
        receiptDate: data.receiptDate ? dayjs(data.receiptDate, 'YYYY-MM-DD') : undefined,
        items: data.items.map((item: any) => ({
          ...item,
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: Number(item.unitPrice),
          quantity: Number(item.quantity),
          subtotal: Number(item.subtotal)
        }))
      });
    } catch (error) {
      message.error('Gagal mengambil data receipt');
      navigate('/purchase/receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await purchaseReceiptService.update(id!, values);
      message.success('Receipt berhasil diperbarui');
      navigate('/purchase/receipts');
    } catch (error) {
      message.error('Gagal memperbarui receipt');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!receipt) {
    return null;
  }

  return (
    <Card title="Edit Purchase Receipt">
      <PurchaseReceiptForm 
        form={form}
        onFinish={handleSubmit}
        initialValues={receipt}
        isEdit={true}
      />
    </Card>
  );
}; 