import { useState, useEffect } from 'react';
import { productService } from '@/api/product/product.api';
import { Product } from '@/types/product.types';

interface PaginatedResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useProducts = (page: number = 1, limit: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (currentPage: number = page, currentLimit: number = limit) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: PaginatedResponse = await productService.getAll(currentPage, currentLimit);
      setProducts(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  return {
    products,
    isLoading,
    error,
    totalPages,
    currentPage: page,
    fetchProducts,
  };
}; 