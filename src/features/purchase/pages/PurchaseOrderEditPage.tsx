import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { PurchaseOrderForm } from '../components/order/PurchaseOrderForm';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseOrderService } from '@/api/purchase/order.api';
import { PurchaseOrder } from '@/types/purchase.types';

export const PurchaseOrderEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await purchaseOrderService.getById(id!);
        if (response.success) {
          setPurchaseOrder(response.data);
        } else {
          message.error('Gagal mengambil data Purchase Order');
          navigate('/purchase/orders');
        }
      } catch (error) {
        message.error('Terjadi kesalahan saat mengambil data');
        navigate('/purchase/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPurchaseOrder();
    } else {
      navigate('/purchase/orders');
    }
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!purchaseOrder) {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* <Card title="Edit Purchase Order"> */}
        <PurchaseOrderForm purchaseOrder={purchaseOrder} />
      {/* </Card> */}
    </div>
  );
}; 