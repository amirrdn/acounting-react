import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { PurchaseOrderForm } from '../components/order/PurchaseOrderForm';

export const PurchaseOrderNewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const requestId = location.state?.requestId;

  React.useEffect(() => {
    if (!requestId) {
      message.error('Tidak ada data purchase request yang dipilih');
      navigate('/purchase/orders');
    }
  }, [requestId, navigate]);

  if (!requestId) {
    return null;
  }

  return (
    <div>
      <h1>Buat Purchase Order Baru</h1>
      <PurchaseOrderForm requestId={requestId} />
    </div>
  );
}; 