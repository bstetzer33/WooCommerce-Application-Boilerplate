import { useEffect, useState } from 'react';
import apiClient from '@services/api';
import { Review } from '@types/index';
import { handleApiError } from '@utils/errorHandler';

export const useReviews = (productId: number | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getProductReviews(productId);
        setReviews(response.data);
      } catch (err) {
        const error = handleApiError(err);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  return { reviews, loading, error };
};
