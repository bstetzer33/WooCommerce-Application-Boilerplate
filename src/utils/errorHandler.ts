import { AxiosError } from 'axios';
import { ApiError } from '@types/index';

export const getErrorMessage = (error: any): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const isNetworkError = (error: any): boolean => {
  if (error instanceof AxiosError) {
    return !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
  }
  return false;
};

export const isAuthError = (error: any): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
};

export const isValidationError = (error: any): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400 || error.response?.status === 422;
  }
  return false;
};

export const getValidationErrors = (error: any): Record<string, string[]> => {
  if (error instanceof AxiosError && error.response?.data?.errors) {
    return error.response.data.errors;
  }
  return {};
};

export const handleApiError = (error: any): ApiError => {
  const message = getErrorMessage(error);
  const code = error?.response?.status?.toString() || 'UNKNOWN_ERROR';
  const data = error?.response?.data || {};

  return {
    code,
    message,
    data,
  };
};
