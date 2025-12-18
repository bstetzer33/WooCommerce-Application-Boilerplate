import { useEffect, useState } from 'react';
import apiClient from '@services/api';
import { Product, ProductFilters, PaginatedResponse } from '@types/index';
import { handleApiError } from '@utils/errorHandler';

export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current_page: 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getProducts(filters);
        setProducts(response.data);
        setPagination({
          total: response.headers['x-wp-total'] || 0,
          pages: response.headers['x-wp-totalpages'] || 0,
          current_page: filters?.page || 1,
        });
      } catch (err) {
        const error = handleApiError(err);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error, pagination };
};

export const useProduct = (productId: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getProduct(productId);
        setProduct(response.data);
      } catch (err) {
        const error = handleApiError(err);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
};

export const useSearch = (searchTerm: string, enabled: boolean = true) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.searchProducts(searchTerm);
        setResults(response.data);
      } catch (err) {
        const error = handleApiError(err);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, enabled]);

  return { results, loading, error };
};
