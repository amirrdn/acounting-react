import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../router/ProtectedRoute';
import { Role } from '../constants/roles';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import NotFound from './NotFound';

// Auth
import LoginPage from '@features/auth/pages/LoginPage';
import RegisterPage from '@features/auth/pages/RegisterPage';

// Dashboard
import DashboardHome from '@features/dashboard/pages/DashboardHome';

// Customer
import CustomerList from '@features/customer/pages/CustomerList';
import CustomerForm from '@features/customer/pages/CustomerForm';

// Sales
import { SalesList } from '@features/sales/pages/SalesList';
import { CreateSale } from '@features/sales/pages/sales/CreateSale';

// Accounts
import AccountsPage from '@features/accounts/pages/AccountsPage';

// Product
import { ProductList } from '@features/product/components/ProductList';
import { ProductForm } from '@features/product/components/ProductForm';

// Purchase
import PurchaseRequestPage from '@features/purchase/pages/request/index';
import PurchaseRequestFormPage from '@features/purchase/pages/request/form';
import PurchaseRequestDetail from '@features/purchase/pages/request/detail';
import PurchaseOrderPage from '@features/purchase/pages/order/index';
import { PurchaseOrderNewPage } from '@features/purchase/pages/PurchaseOrderNewPage';
import { PurchaseOrderEditPage } from '@features/purchase/pages/PurchaseOrderEditPage';
import GoodsReceiptPage from '@features/purchase/pages/receipt/index';
import { 
  PaymentListPage, 
  PaymentDetailPage, 
  PaymentCreatePage, 
  PaymentEditPage 
} from '@features/purchase/pages/payment/index';
import { PurchaseReceiptList } from '@features/purchase/components/receipt/PurchaseReceiptList';
import { PurchaseReceiptCreate } from '@features/purchase/components/receipt/PurchaseReceiptCreate';
import { PurchaseReceiptEdit } from '@features/purchase/components/receipt/PurchaseReceiptEdit';
import { PurchaseInvoiceList } from '@features/purchase/components/invoice/PurchaseInvoiceList';
import { PurchaseInvoiceForm } from '@features/purchase/components/invoice/PurchaseInvoiceForm';
import { PurchaseInvoiceDetail } from '@features/purchase/components/invoice/PurchaseInvoiceDetail';

// Supplier
import SupplierList from '@components/supplier/SupplierList';
import SupplierForm from '@components/supplier/SupplierForm';

// Cash Bank
import { CashBankPage } from '@features/cash-bank/pages/CashBankPage';

// Budget
import BudgetPage from './BudgetPage';
import BudgetDetailPage from './BudgetDetailPage';
import BudgetReportPage from './BudgetReportPage';
import BudgetNewPage from './BudgetNewPage';

// Inventory
import StockList from '../features/inventory/StockList';
import StockTransferForm from '../features/inventory/StockTransferForm';
import StockOpnameForm from '../features/inventory/StockOpnameForm';
import StockAdjustmentForm from '../features/inventory/StockAdjustmentForm';
import StockCard from '../features/inventory/StockCard';
import StockOpnameList from '../features/inventory/StockOpnameList';
import StockOpnameDetail from '../features/inventory/StockOpnameDetail';
import StockTransferList from '../features/inventory/StockTransferList';
import StockAdjustmentList from '../features/inventory/StockAdjustmentList';
import StockTransferDetail from '../features/inventory/StockTransferDetail';
import StockAdjustmentDetail from '../features/inventory/StockAdjustmentDetail';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* Inventory Routes */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <StockList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stocks"
          element={
            <ProtectedRoute>
              <StockList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-transfer"
          element={
            <ProtectedRoute>
              <StockTransferList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-transfer/new"
          element={
            <ProtectedRoute>
              <StockTransferForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-transfer/:id"
          element={
            <ProtectedRoute>
              <StockTransferDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-opname"
          element={
            <ProtectedRoute>
              <StockOpnameList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-opname/new"
          element={
            <ProtectedRoute>
              <StockOpnameForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-opname/:id"
          element={
            <ProtectedRoute>
              <StockOpnameDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-adjustment"
          element={
            <ProtectedRoute>
              <StockAdjustmentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-adjustment/new"
          element={
            <ProtectedRoute>
              <StockAdjustmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-adjustment/:id"
          element={
            <ProtectedRoute>
              <StockAdjustmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock-card/:productId"
          element={
            <ProtectedRoute>
              <StockCard />
            </ProtectedRoute>
          }
        />

        {/* Production Routes */}
        <Route
          path="/production"
          element={
            <ProtectedRoute>
              <div>Production Page</div>
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute roles={[Role.admin, Role.sales]}>
              <CustomerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.sales]}>
              <CustomerForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/edit/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.sales]}>
              <CustomerForm />
            </ProtectedRoute>
          }
        />

        {/* Budget Routes */}
        <Route
          path="/budget"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <BudgetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <BudgetDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget/report"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <BudgetReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <BudgetNewPage />
            </ProtectedRoute>
          }
        />

        {/* Sales Routes */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute roles={[Role.admin, Role.sales]}>
              <SalesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.sales]}>
              <CreateSale />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/edit/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.sales]}>
              <CreateSale />
            </ProtectedRoute>
          }
        />

        {/* Product Routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute roles={[Role.admin]}>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute roles={[Role.admin]}>
              <ProductForm />
            </ProtectedRoute>
          }
        />

        {/* Accounts Routes */}
        <Route
          path="/accounts"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <AccountsPage />
            </ProtectedRoute>
          }
        />

        {/* Purchase Routes */}
        <Route
          path="/purchase/request"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/request/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseRequestFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/request/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseRequestDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/orders"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/order/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseOrderNewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/orders/edit/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseOrderEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/receipts"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <GoodsReceiptPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/receipts/list"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseReceiptList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/receipts/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseReceiptCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/receipts/:id/edit"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseReceiptEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/payment"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PaymentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/payment/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PaymentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/payment/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PaymentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase/payment/:id/edit"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PaymentEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/invoices"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseInvoiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/invoices/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseInvoiceForm mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/invoices/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseInvoiceDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/invoices/:id/edit"
          element={
            <ProtectedRoute roles={[Role.admin, Role.finance]}>
              <PurchaseInvoiceForm mode="edit" />
            </ProtectedRoute>
          }
        />

        {/* Supplier Routes */}
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute roles={[Role.admin, Role.purchase]}>
              <SupplierList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers/new"
          element={
            <ProtectedRoute roles={[Role.admin, Role.purchase]}>
              <SupplierForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers/edit/:id"
          element={
            <ProtectedRoute roles={[Role.admin, Role.purchase]}>
              <SupplierForm />
            </ProtectedRoute>
          }
        />

        {/* Cash Bank Routes */}
        <Route
          path="/cash-bank"
          element={
            <ProtectedRoute roles={[Role.admin, Role.accounting, Role.finance]}>
              <CashBankPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route - Must be the last route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 