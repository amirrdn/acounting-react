import CustomerList from '../features/customer/pages/CustomerList';
import CustomerForm from '../features/customer/pages/CustomerForm';
import { createBrowserRouter } from 'react-router-dom';
import { SalesList } from '../features/sales/pages/SalesList';
import { CreateSale } from '../features/sales/pages/sales/CreateSale';
import { PurchaseOrderList } from '../features/purchase/pages/PurchaseOrderList';
import { PurchaseReceiptList } from '../features/purchase/components/receipt/PurchaseReceiptList';
import { PurchaseInvoiceList } from '../features/purchase/components/invoice/PurchaseInvoiceList';
import { PaymentList } from '../features/purchase/pages/PaymentList';
import { PurchaseOrderNewPage } from '../features/purchase/pages/PurchaseOrderNewPage';
import { ProtectedRoute } from './ProtectedRoute';
import { Role } from '../constants/roles';
import { PurchaseInvoiceForm } from '../features/purchase/components/invoice/PurchaseInvoiceForm';
import { PurchaseInvoiceDetail } from '../features/purchase/components/invoice/PurchaseInvoiceDetail';

export const router = createBrowserRouter([
  {
    path: '/customers',
    element: <ProtectedRoute><CustomerList /></ProtectedRoute>
  },
  {
    path: '/customers/create',
    element: <ProtectedRoute><CustomerForm /></ProtectedRoute>
  },
  {
    path: '/customers/edit/:id',
    element: <ProtectedRoute><CustomerForm /></ProtectedRoute>
  },
  {
    path: '/sales',
    element: <ProtectedRoute><SalesList /></ProtectedRoute>
  },
  {
    path: '/sales/new',
    element: <ProtectedRoute><CreateSale /></ProtectedRoute>
  },
  {
    path: '/purchases/orders',
    element: <ProtectedRoute roles={[Role.admin, Role.purchase, Role.manager, Role.finance]}><PurchaseOrderList /></ProtectedRoute>
  },
  {
    path: '/purchases/orders/new',
    element: <ProtectedRoute roles={[Role.admin, Role.purchase, Role.manager, Role.finance]}><PurchaseOrderNewPage /></ProtectedRoute>
  },
  {
    path: '/purchases/receipts',
    element: <ProtectedRoute roles={[Role.admin, Role.purchase, Role.manager, Role.finance]}><PurchaseReceiptList /></ProtectedRoute>
  },
  {
    path: '/purchases/invoices',
    element: <ProtectedRoute roles={[Role.admin, Role.finance]}><PurchaseInvoiceList /></ProtectedRoute>
  },
  {
    path: '/purchases/invoices/new',
    element: <ProtectedRoute roles={[Role.admin, Role.finance]}><PurchaseInvoiceForm mode="create" /></ProtectedRoute>
  },
  {
    path: '/purchases/invoices/:id',
    element: <ProtectedRoute roles={[Role.admin, Role.finance]}><PurchaseInvoiceDetail /></ProtectedRoute>
  },
  {
    path: '/purchases/payments',
    element: <ProtectedRoute roles={[Role.admin, Role.purchase]}><PaymentList /></ProtectedRoute>
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
}); 