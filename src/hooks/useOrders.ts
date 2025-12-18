import { useEffect, useState } from 'react';
import apiClient from '@services/api';
import { Order } from '@types/index';
import { handleApiError } from '@utils/errorHandler';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getOrders();
        setOrders(response.data);
      } catch (err) {
        const error = handleApiError(err);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};

export const useOrder = (orderId: number | null) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getOrder(orderId);
        setOrder(response.data);
      } catch (err) {
        const error = handleApiError(err);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};
