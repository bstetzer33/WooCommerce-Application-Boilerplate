import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, CONSUMER_KEY, CONSUMER_SECRET, API_TIMEOUT, STORAGE_KEYS } from '@constants/index';

class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.consumerKey = CONSUMER_KEY;
    this.consumerSecret = CONSUMER_SECRET;

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add WooCommerce authentication if no JWT token
        if (!token && this.consumerKey && this.consumerSecret) {
          config.auth = {
            username: this.consumerKey,
            password: this.consumerSecret,
          };
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle token refresh on 401
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              // Make refresh request
              const response = await this.axiosInstance.post('/auth/token/refresh', {
                refresh_token: refreshToken,
              });
              
              const { access_token } = response.data;
              await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, access_token);
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            await this.clearAuth();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public async clearAuth(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // Product endpoints
  public getProducts(params: any = {}) {
    return this.axiosInstance.get('/products', { params });
  }

  public getProduct(id: number) {
    return this.axiosInstance.get(`/products/${id}`);
  }

  public searchProducts(search: string, params: any = {}) {
    return this.axiosInstance.get('/products', {
      params: { search, ...params },
    });
  }

  // Category endpoints
  public getCategories(params: any = {}) {
    return this.axiosInstance.get('/products/categories', { params });
  }

  public getCategory(id: number) {
    return this.axiosInstance.get(`/products/categories/${id}`);
  }

  // Customer endpoints
  public getCustomer(id: number) {
    return this.axiosInstance.get(`/customers/${id}`);
  }

  public createCustomer(data: any) {
    return this.axiosInstance.post('/customers', data);
  }

  public updateCustomer(id: number, data: any) {
    return this.axiosInstance.put(`/customers/${id}`, data);
  }

  // Order endpoints
  public getOrders(params: any = {}) {
    return this.axiosInstance.get('/orders', { params });
  }

  public getOrder(id: number) {
    return this.axiosInstance.get(`/orders/${id}`);
  }

  public createOrder(data: any) {
    return this.axiosInstance.post('/orders', data);
  }

  // Review endpoints
  public getProductReviews(productId: number, params: any = {}) {
    return this.axiosInstance.get(`/products/${productId}/reviews`, { params });
  }

  public createReview(productId: number, data: any) {
    return this.axiosInstance.post(`/products/${productId}/reviews`, data);
  }

  // Coupon endpoints
  public applyCoupon(code: string) {
    return this.axiosInstance.get('/coupons', {
      params: { code },
    });
  }

  // Auth endpoints (custom implementation)
  public loginWithEmail(email: string, password: string) {
    return this.axiosInstance.post('/auth/login', { email, password });
  }

  public registerUser(data: any) {
    return this.axiosInstance.post('/auth/register', data);
  }

  public requestPasswordReset(email: string) {
    return this.axiosInstance.post('/auth/password-reset', { email });
  }

  public resetPassword(token: string, newPassword: string) {
    return this.axiosInstance.post('/auth/password-reset/confirm', {
      token,
      new_password: newPassword,
    });
  }
}

export default new ApiClient();
