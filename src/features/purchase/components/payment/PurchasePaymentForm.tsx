import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Card, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/api/account/account.api';
import { supplierService } from '@/api/supplier';
import { purchasePaymentService } from '@/api/purchase/payment.service';
import { purchaseInvoiceService } from '@/api/purchase/invoice.api';
import { PurchaseInvoice } from '@/api/purchase/types';

interface PurchasePaymentFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

export const PurchasePaymentForm: React.FC<PurchasePaymentFormProps> = ({ initialValues, onSubmit, isEdit = false }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  const { data: paymentData } = useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      if (!id) return null;
      return await purchasePaymentService.getById(id);
    },
    enabled: !!id,
  });

  const searchParams = new URLSearchParams(location.search);
  const invoiceId = searchParams.get('invoiceId') || 
                   initialValues?.purchaseInvoiceId || 
                   (isEdit && paymentData?.purchaseInvoice?.id);

  const { data: invoiceData, error: invoiceError } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null;
      try {
        const invoice = await purchaseInvoiceService.getById(invoiceId);
        return invoice as PurchaseInvoice;
      } catch (error) {
        message.error('Gagal mengambil data invoice: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
        return null;
      }
    },
    enabled: !!invoiceId && !isEdit,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => supplierService.getAll(),
  });

  const { data: accountsData } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await accountService.getAll();
      return response.data;
    },
  });

  const { data: unpaidInvoices = [] } = useQuery<PurchaseInvoice[]>({
    queryKey: ['unpaidInvoices', selectedSupplier],
    queryFn: async () => {
      if (!selectedSupplier) return [];
      const invoices = await purchasePaymentService.getUnpaidInvoices(selectedSupplier);
      return invoices as PurchaseInvoice[];
    },
    enabled: !!selectedSupplier,
  });

  useEffect(() => {
    if (invoiceError) {
      message.error('Gagal mengambil data invoice: ' + (invoiceError instanceof Error ? invoiceError.message : 'Terjadi kesalahan'));
    }
  }, [invoiceError]);

  useEffect(() => {
    if (paymentData && paymentData.purchaseInvoice && paymentData.paymentAccount) {
      setSelectedSupplier(paymentData.purchaseInvoice.supplier.id);
      setSelectedInvoice(paymentData.purchaseInvoice);
      form.setFieldsValue({
        supplierId: paymentData.purchaseInvoice.supplier.id,
        purchaseInvoiceId: paymentData.purchaseInvoice.id,
        amount: paymentData.amount || 0,
        paymentDate: paymentData.paymentDate ? dayjs(paymentData.paymentDate) : dayjs(),
        paymentAccountId: paymentData.paymentAccountId,
        notes: paymentData.notes || '',
      });
    }
  }, [paymentData, form]);

  useEffect(() => {
    if (invoiceId && !form.getFieldValue('purchaseInvoiceId')) {
      form.setFieldsValue({
        purchaseInvoiceId: invoiceId
      });
    }
  }, [invoiceId, form]);

  useEffect(() => {
    if (invoiceData) {
      setSelectedInvoice(invoiceData);
      setSelectedSupplier(invoiceData.supplier.id);
      form.setFieldsValue({
        supplierId: invoiceData.supplier.id,
        purchaseInvoiceId: invoiceData.id,
        amount: invoiceData.remainingAmount,
        paymentDate: dayjs(),
      });
    }
  }, [invoiceData, form]);

  const handleSubmit = useCallback(async (values: any) => {
    if (!values.purchaseInvoiceId) {
      message.error('Invoice ID is required');
      return;
    }
    const formattedValues = {
      ...values,
      paymentDate: values.paymentDate.format('YYYY-MM-DD'),
      amount: Number(values.amount.replace(/[^0-9.-]+/g, '')),
      purchaseInvoiceId: selectedInvoice?.id || values.purchaseInvoiceId,
    };
    await onSubmit(formattedValues);
  }, [onSubmit, selectedInvoice]);

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = unpaidInvoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      form.setFieldValue('amount', invoice.remainingAmount);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          {initialValues ? 'Edit Pembayaran' : 'Buat Pembayaran Baru'}
        </h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
          className="space-y-4"
        >
          <Form.Item
            name="paymentDate"
            label="Tanggal Pembayaran"
            rules={[{ required: true, message: 'Tanggal pembayaran harus diisi' }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="supplierId"
            label="Supplier"
            rules={[{ required: true, message: 'Supplier harus dipilih' }]}
          >
            <Select
              showSearch
              placeholder="Pilih Supplier"
              optionFilterProp="children"
              onChange={(value) => setSelectedSupplier(value)}
              disabled={!!invoiceId}
              className="w-full"
            >
              {Array.isArray(suppliersData) && suppliersData.map((supplier: any) => (
                <Select.Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="purchaseInvoiceId"
            label="Invoice"
            rules={[{ required: true, message: 'Invoice harus dipilih' }]}
          >
            <Select
              showSearch
              placeholder="Pilih Invoice"
              optionFilterProp="children"
              disabled={!selectedSupplier || !!invoiceId}
              onChange={handleInvoiceSelect}
              className="w-full"
            >
              {unpaidInvoices.map((invoice: any) => (
                <Select.Option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - Rp {invoice.remainingAmount.toLocaleString('id-ID')}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedInvoice && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Nomor Invoice:</span>
                  <span className="text-gray-900">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Tanggal Invoice:</span>
                  <span className="text-gray-900">{dayjs(selectedInvoice.invoiceDate).format('DD/MM/YYYY')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Total Invoice:</span>
                  <span className="text-gray-900">Rp {selectedInvoice.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Sudah Dibayar:</span>
                  <span className="text-gray-900">Rp {selectedInvoice.paidAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Sisa yang Harus Dibayar:</span>
                  <span className="text-gray-900">Rp {selectedInvoice.remainingAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Jatuh Tempo:</span>
                  <span className="text-gray-900">{dayjs(selectedInvoice.dueDate).format('DD/MM/YYYY')}</span>
                </div>
              </div>
            </div>
          )}

          <Form.Item
            name="amount"
            label="Jumlah Pembayaran"
            rules={[
              { required: true, message: 'Jumlah pembayaran harus diisi' },
              { 
                validator: (_, value) => {
                  if (!value) return Promise.reject('Jumlah pembayaran harus diisi');
                  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
                  if (isNaN(numericValue) || numericValue <= 0) {
                    return Promise.reject('Jumlah pembayaran harus lebih dari 0');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input
              className="w-full"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                const formattedValue = value ? `Rp ${parseInt(value).toLocaleString('id-ID')}` : '';
                e.target.value = formattedValue;
              }}
            />
          </Form.Item>

          <Form.Item
            name="paymentAccountId"
            label="Akun Pembayaran"
            rules={[{ required: true, message: 'Pilih akun pembayaran' }]}
          >
            <Select
              placeholder="Pilih akun pembayaran"
              className="w-full"
            >
              {Array.isArray(accountsData) && accountsData.map((account) => (
                <Select.Option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Catatan"
          >
            <Input.TextArea rows={4} className="w-full" />
          </Form.Item>

          <Form.Item>
            <div className="flex flex-col md:flex-row gap-2">
              <Button 
                type="primary" 
                htmlType="submit"
                className="w-full md:w-auto"
              >
                {initialValues ? 'Update' : 'Simpan'}
              </Button>
              <Button 
                onClick={() => navigate('/purchase/payment')}
                className="w-full md:w-auto"
              >
                Batal
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}; 