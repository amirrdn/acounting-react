import { Routes, Route } from 'react-router-dom';
import { PurchaseReceiptList } from './components/receipt/PurchaseReceiptList';
import { PurchaseReceiptCreate } from './components/receipt/PurchaseReceiptCreate';
import { PurchaseReceiptEdit } from './components/receipt/PurchaseReceiptEdit';

export const PurchaseRoutes = () => {
  return (
    <Routes>
      <Route path="/receipts" element={<PurchaseReceiptList />} />
      <Route path="/receipts/new" element={<PurchaseReceiptCreate />} />
      <Route path="/receipts/:id/edit" element={<PurchaseReceiptEdit />} />
    </Routes>
  );
}; 