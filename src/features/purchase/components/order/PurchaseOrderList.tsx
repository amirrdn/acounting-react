import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, message, Modal, Form, Input, Grid } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PurchaseOrder } from '@/types/purchase.types';
import { purchaseOrderService } from '@/api/purchase/order.api';
import dayjs from 'dayjs';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/constants/roles';

const { useBreakpoint } = Grid;

export const PurchaseOrderList: React.FC = () => {
  const { user } = useAuth();
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderService.getAll();
      if (response) {
        setPurchaseOrders(response);
      } else {
        message.error('Gagal mengambil data Purchase Order');
      }
    } catch (error: any) {
      console.error('Error fetching purchase orders:', error);
      if (error.response) {
        message.error(`Error: ${error.response.data?.message || 'Terjadi kesalahan pada server'}`);
      } else if (error.request) {
        message.error('Tidak ada respon dari server. Periksa koneksi Anda.');
      } else {
        message.error('Terjadi kesalahan saat mengambil data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/purchase/orders/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await purchaseOrderService.delete(id);
      if (response.success) {
        message.success('Purchase Order berhasil dihapus');
        fetchPurchaseOrders();
      } else {
        message.error(response.message || 'Gagal menghapus Purchase Order');
      }
    } catch (error) {
      message.error('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleApprove = (id: string) => {
    setSelectedPoId(id);
    setIsApprovalModalVisible(true);
  };

  const handleApprovalSubmit = async (values: { approvalNotes: string }) => {
    if (!selectedPoId) return;

    try {
      const response = await purchaseOrderService.updateStatus(selectedPoId, 'APPROVED', values.approvalNotes);
      if (response.success) {
        message.success('Purchase Order berhasil disetujui');
        setIsApprovalModalVisible(false);
        form.resetFields();
        fetchPurchaseOrders();
      } else {
        message.error(response.message || 'Gagal menyetujui Purchase Order');
      }
    } catch (error) {
      message.error('Terjadi kesalahan saat menyetujui PO');
    }
  };

  const columns = [
    {
      title: 'Nomor PO',
      dataIndex: 'poNumber',
      key: 'poNumber',
    },
    {
      title: 'Tanggal',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(amount),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          DRAFT: 'Draft',
          APPROVED: 'Disetujui',
          SENT: 'Terkirim',
          RECEIVED_PARTIAL: 'Diterima Sebagian',
          RECEIVED_FULL: 'Diterima Lengkap'
        };
        return statusMap[status] || status;
      }
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: PurchaseOrder) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record.id)}>Edit</Button>
          {record.status === 'DRAFT' && user?.role === Role.manager && (
            <Button type="link" style={{ color: 'green' }} onClick={() => handleApprove(record.id)}>Approve</Button>
          )}
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Hapus</Button>
        </Space>
      ),
    },
  ];

  const renderMobileCard = (record: PurchaseOrder) => (
    <Card 
      key={record.id}
      style={{ marginBottom: 16 }}
      actions={[
        <Button type="link" onClick={() => handleEdit(record.id)}>Edit</Button>,
        record.status === 'DRAFT' && user?.role === Role.manager ? (
          <Button type="link" style={{ color: 'green' }} onClick={() => handleApprove(record.id)}>Approve</Button>
        ) : null,
        <Button type="link" danger onClick={() => handleDelete(record.id)}>Hapus</Button>
      ].filter(Boolean)}
    >
      <Card.Meta
        title={`PO: ${record.poNumber}`}
        description={
          <>
            <p>Tanggal: {dayjs(record.orderDate).format('DD/MM/YYYY')}</p>
            <p>Supplier: {record.supplier?.name}</p>
            <p>Total: {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(record.totalAmount)}</p>
            <p>Status: {
              {
                DRAFT: 'Draft',
                APPROVED: 'Disetujui',
                SENT: 'Terkirim',
                RECEIVED_PARTIAL: 'Diterima Sebagian',
                RECEIVED_FULL: 'Diterima Lengkap'
              }[record.status] || record.status
            }</p>
          </>
        }
      />
    </Card>
  );

  return (
    <>
      <Card
        title="Daftar Purchase Order"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/purchase/order/new')}
          >
            Buat PO Baru
          </Button>
        }
      >
        {screens.md ? (
          <Table 
            columns={columns} 
            dataSource={purchaseOrders}
            loading={loading}
            rowKey="id"
          />
        ) : (
          <div>
            {purchaseOrders.map(renderMobileCard)}
          </div>
        )}
      </Card>

      <Modal
        title="Persetujuan Purchase Order"
        open={isApprovalModalVisible}
        onCancel={() => {
          setIsApprovalModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApprovalSubmit}
        >
          <Form.Item
            name="approvalNotes"
            label="Catatan Persetujuan"
            rules={[{ required: true, message: 'Masukkan catatan persetujuan' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Setujui
              </Button>
              <Button onClick={() => {
                setIsApprovalModalVisible(false);
                form.resetFields();
              }}>
                Batal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}; 