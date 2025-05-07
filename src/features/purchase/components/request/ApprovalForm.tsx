import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Space, message } from 'antd';
import { PurchaseRequest } from '@/types/purchase.types';
import { purchaseRequestService } from '@/api/purchase/request.api';

const { TextArea } = Input;
const { Option } = Select;

interface ApprovalFormProps {
  visible: boolean;
  request: PurchaseRequest | null;
  products: Array<{
    id: number;
    quantity: number;
    unit: string;
    productStocks:{
      id: number;
    }
  }>;
  onClose: () => void;
  onSuccess: () => void;
  type: 'approve' | 'reject';
}

export const ApprovalForm: React.FC<ApprovalFormProps> = ({
  visible,
  request,
  products,
  onClose,
  onSuccess,
  type
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (type === 'approve') {
        await purchaseRequestService.approve(request!.id, {
          approvalNotes: values.notes,
          approvalDate: values.approvalDate.format('YYYY-MM-DD'),
          budgetCheck: values.budgetCheck,
          stockCheck: values.stockCheck,
          supplierCheck: values.supplierCheck,
          products: products
        });
        message.success('Purchase request berhasil diapprove');
      } else {
        await purchaseRequestService.reject(request!.id, {
          rejectionNotes: values.notes,
          rejectionDate: values.rejectionDate.format('YYYY-MM-DD'),
          rejectionReason: values.reason
        });
        message.success('Purchase request berhasil direject');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message || `Gagal ${type} purchase request`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Form ${type === 'approve' ? 'Approval' : 'Rejection'} Purchase Request`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="notes"
          label={type === 'approve' ? "Catatan Approval" : "Catatan Rejection"}
          rules={[{ required: true, message: `Catatan ${type === 'approve' ? 'approval' : 'rejection'} harus diisi` }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name={type === 'approve' ? "approvalDate" : "rejectionDate"}
          label="Tanggal"
          rules={[{ required: true, message: 'Tanggal harus diisi' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {type === 'approve' && (
          <>
            <Form.Item
              name="budgetCheck"
              label="Cek Budget"
              rules={[{ required: true, message: 'Status cek budget harus diisi' }]}
            >
              <Select>
                <Option value="OK">OK</Option>
                <Option value="NOT_OK">Tidak OK</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="stockCheck"
              label="Cek Stok"
              rules={[{ required: true, message: 'Status cek stok harus diisi' }]}
            >
              <Select>
                <Option value="OK">OK</Option>
                <Option value="NOT_OK">Tidak OK</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="supplierCheck"
              label="Cek Supplier"
              rules={[{ required: true, message: 'Status cek supplier harus diisi' }]}
            >
              <Select>
                <Option value="OK">OK</Option>
                <Option value="NOT_OK">Tidak OK</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {type === 'reject' && (
          <Form.Item
            name="reason"
            label="Alasan Rejection"
            rules={[{ required: true, message: 'Alasan rejection harus diisi' }]}
          >
            <Select>
              <Option value="BUDGET_EXCEEDED">Budget Exceeded</Option>
              <Option value="SUPPLIER_ISSUE">Supplier Issue</Option>
              <Option value="STOCK_AVAILABLE">Stock Available</Option>
              <Option value="OTHER">Lainnya</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
            <Button onClick={onClose}>
              Batal
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}; 