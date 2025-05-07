import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PurchasePaymentList, PurchasePaymentDetail, PurchasePaymentForm } from '../../components/payment';
import { createPayment, updatePayment } from '@/api/purchase/payment.api';
import { useAuth } from '@/hooks/useAuth';

export const PaymentListPage: React.FC = () => {
  return <PurchasePaymentList />;
};

export const PaymentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  return <PurchasePaymentDetail id={id!} />;
};

export const PaymentCreatePage = () => {  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rawInvoiceId = searchParams.get('invoiceId');
  
  const invoiceId = rawInvoiceId ? rawInvoiceId : null;
  
  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      message.success('Payment created successfully');
      navigate('/purchase/payment');
      queryClient.invalidateQueries({ queryKey: ['purchasePayments'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        message.error('Gagal membuat pembayaran: ' + (error.message || 'Terjadi kesalahan'));
      }
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      if (!values.purchaseInvoiceId) {
        message.error('Invoice ID is required');
        return;
      }
      const formattedValues = {
        ...values,
        purchaseInvoiceId: Number(values.purchaseInvoiceId)
      };
      await createMutation.mutateAsync(formattedValues);
    } catch (error) {
      message.error('Gagal mengirim pembayaran: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const initialValues = invoiceId ? { invoiceId } : undefined;

  return <PurchasePaymentForm onSubmit={handleSubmit} initialValues={initialValues} />;
};


export const PaymentEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const updateMutation = useMutation({
    mutationFn: (values: any) => updatePayment(Number(id!), values),
    onSuccess: () => {
      message.success('Payment updated successfully');
      navigate('/purchase/payment');
      queryClient.invalidateQueries({ queryKey: ['purchasePayments'] });
    },
    onError: (error: any) => {
      message.error('Gagal memperbarui pembayaran: ' + (error.message || 'Terjadi kesalahan'));
    },
  });

  const handleSubmit = async (values: any): Promise<void> => {
    await updateMutation.mutateAsync(values);
  };

  return <PurchasePaymentForm onSubmit={handleSubmit} isEdit={true} />;
}; 