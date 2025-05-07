import { createBrowserRouter } from 'react-router-dom';
import { ProductList } from '../features/product/components/ProductList';
import { ProductForm } from '../features/product/components/ProductForm';

export const router = createBrowserRouter([
  {
    path: '/products',
    element: <ProductList />
  },
  {
    path: '/products/create',
    element: <ProductForm />
  },
  {
    path: '/products/edit/:id',
    element: <ProductForm />
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
});
