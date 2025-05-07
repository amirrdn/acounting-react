import React, { useEffect, useState } from 'react';
import { Card, Button, Space, message, Descriptions, Spin, Table } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { PurchaseRequest, PurchaseRequestItem } from '@/types/purchase.types';
import { purchaseRequestService } from '@/api/purchase/request.api';
import { ApprovalForm } from '../../components/request/ApprovalForm';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/constants/roles';

const PurchaseRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const data = await purchaseRequestService.getById(id!);
      setRequest(data);
    } catch (error) {
      message.error('Gagal mengambil data permintaan: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const handleShowApprovalForm = (type: 'approve' | 'reject') => {
    setApprovalType(type);
    setShowApprovalForm(true);
  };

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  const canApprove = user?.role === Role.manager || user?.role === Role.admin;

  if (loading) return <Spin />;
  if (!request) return null;

  const columns = [
    {
      title: 'Produk',
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (name: string, record: PurchaseRequestItem) => name || record.product?.sku || 'N/A',
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Satuan',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Catatan',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string | null | undefined) => notes || '-',
    },
  ];

  const handleBack = () => {
    navigate('/purchase/request');
  };
    
  const productsForApproval = request.items
    ?.filter((item): item is PurchaseRequestItem & { product: NonNullable<PurchaseRequestItem['product']> } => !!item.product)
    .map(item => ({
      id: item.product.id,
      quantity: item.quantity,
      unit: item.unit,
      productStocks:{
        id: Number(item.id)
      }
    })) || [];

  return (
    <>
      <Card
        title="Detail Purchase Request"
        extra={
          <Space>
            {request.status === 'PENDING' && canApprove && (
              <>
                <Button type="primary" onClick={() => handleShowApprovalForm('approve')}>
                  Approve
                </Button>
                <Button danger onClick={() => handleShowApprovalForm('reject')}>
                  Reject
                </Button>
              </>
            )}
            <Button onClick={handleBack}>
              Kembali
            </Button>
          </Space>
        }
      >
        <Descriptions bordered size="small" layout="vertical">
          <Descriptions.Item label="Nomor Request">{request.requestNumber}</Descriptions.Item>
          <Descriptions.Item label="Tanggal">{new Date(request.requestDate).toLocaleDateString('id-ID')}</Descriptions.Item>
          <Descriptions.Item label="Departemen">{request.department}</Descriptions.Item>
          <Descriptions.Item label="Status">{request.status}</Descriptions.Item>
          <Descriptions.Item label="Requested By">
            {request.requestedById?.username ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Notes" span={3}>{request.notes ?? '-'}</Descriptions.Item>
        </Descriptions>

        <Card title="Item Request" style={{ marginTop: 16 }}>
          <Table
            columns={columns}
            dataSource={request.items || []}
            rowKey={(item) => item.id || Math.random()}
            pagination={false}
            size="small"
          />
        </Card>
      </Card>

      {request && (
         <ApprovalForm
           visible={showApprovalForm}
           request={request}
           type={approvalType}
           products={productsForApproval}
           onClose={() => setShowApprovalForm(false)}
           onSuccess={() => {
             setShowApprovalForm(false);
             fetchRequest();
           }}
         />
      )}
    </>
  );
};

export default PurchaseRequestDetail;
