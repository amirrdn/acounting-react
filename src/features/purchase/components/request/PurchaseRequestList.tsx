import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PurchaseRequest } from '@/types/purchase.types';
import { purchaseRequestService } from '@/api/purchase/request.api';
import { ApprovalForm } from './ApprovalForm';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/constants/roles';

export const PurchaseRequestList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');

  const canCreate = user?.role === Role.admin || user?.role === Role.purchase;
  const canApprove = user?.role === Role.manager || user?.role === Role.admin;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await purchaseRequestService.getAll();
      setRequests(data.data);
    } catch (error: any) {
      message.error('Gagal mengambil data purchase request');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await purchaseRequestService.delete(id);
      message.success('Purchase request berhasil dihapus');
      fetchRequests();
    } catch (error: any) {
      message.error('Gagal menghapus purchase request');
    }
  };

  const handleShowApprovalForm = (request: PurchaseRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setApprovalType(type);
    setShowApprovalForm(true);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    {
      title: 'Nomor Request',
      dataIndex: 'requestNumber',
      key: 'requestNumber',
    },
    {
      title: 'Tanggal',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Departemen',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Requested By',
      dataIndex: ['requestedById', 'username'],
      key: 'requestedById',
      render: (_text: string, record: PurchaseRequest) => record.requestedById?.username || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch (status) {
          case 'DRAFT':
            color = 'default';
            break;
          case 'PENDING':
            color = 'processing';
            break;
          case 'APPROVED':
            color = 'success';
            break;
          case 'REJECTED':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: PurchaseRequest) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/purchase/request/${record.id}`)}>View</Button>
          {record.status === 'DRAFT' && canCreate && (
            <>
              <Button type="link" onClick={() => navigate(`/purchase/request/${record.id}/edit`)}>Edit</Button>
              <Button 
                type="link" 
                danger 
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin menghapus purchase request ini?')) {
                    handleDelete(record.id);
                  }
                }}
              >
                Hapus
              </Button>
            </>
          )}
          {record.status === 'PENDING' && canApprove && (
            <>
              <Button 
                type="link" 
                style={{ color: 'green' }} 
                onClick={() => handleShowApprovalForm(record, 'approve')}
              >
                Approve
              </Button>
              <Button 
                type="link" 
                danger 
                onClick={() => handleShowApprovalForm(record, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'APPROVED' && canCreate && (
            <Button 
              type="link" 
              style={{ color: 'blue' }} 
              onClick={() => navigate('/purchase/order/new', { state: { requestId: record.id } })}
            >
              Buat PO
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const tableData = Array.isArray(requests) 
    ? requests.map((request: PurchaseRequest) => ({
        ...request,
        key: request.id
      }))
    : [];

  return (
    <>
      <Card
        title="Daftar Purchase Request"
        extra={
          canCreate && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/purchase/request/new')}
            >
              Buat Request Baru
            </Button>
          )
        }
      >
        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <Table 
            columns={columns} 
            dataSource={tableData}
            rowKey="id"
            loading={loading}
          />
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center">Memuat...</div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{request.requestNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Tag color={
                      request.status === 'DRAFT' ? 'default' :
                      request.status === 'PENDING' ? 'processing' :
                      request.status === 'APPROVED' ? 'success' :
                      request.status === 'REJECTED' ? 'error' : 'default'
                    }>
                      {request.status}
                    </Tag>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-24">Departemen:</span>
                      <span className="text-gray-900">{request.department}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-24">Requested By:</span>
                      <span className="text-gray-900">{request.requestedById?.username || '-'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button 
                      type="link" 
                      className="p-0"
                      onClick={() => navigate(`/purchase/request/${request.id}`)}
                    >
                      View
                    </Button>
                    
                    {request.status === 'DRAFT' && canCreate && (
                      <>
                        <Button 
                          type="link" 
                          className="p-0"
                          onClick={() => navigate(`/purchase/request/${request.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          type="link" 
                          danger 
                          className="p-0"
                          onClick={() => {
                            if (window.confirm('Apakah Anda yakin ingin menghapus purchase request ini?')) {
                              handleDelete(request.id);
                            }
                          }}
                        >
                          Hapus
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'PENDING' && canApprove && (
                      <>
                        <Button 
                          type="link" 
                          className="p-0 text-green-600"
                          onClick={() => handleShowApprovalForm(request, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          type="link" 
                          danger 
                          className="p-0"
                          onClick={() => handleShowApprovalForm(request, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'APPROVED' && canCreate && (
                      <Button 
                        type="link" 
                        className="p-0 text-blue-600"
                        onClick={() => navigate('/purchase/order/new', { state: { requestId: request.id } })}
                      >
                        Buat PO
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <ApprovalForm
        visible={showApprovalForm}
        request={selectedRequest}
        type={approvalType}
        products={selectedRequest?.items?.filter(item => item.product).map(item => ({
          id: item.product.id,
          quantity: item.quantity,
          unit: item.unit,
          productStocks: { id: Number(item.id) }
        })) || []}
        onClose={() => setShowApprovalForm(false)}
        onSuccess={fetchRequests}
      />
    </>
  );
}; 