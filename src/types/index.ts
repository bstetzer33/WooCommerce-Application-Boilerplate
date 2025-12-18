// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: ProductImage[];
  categories: Category[];
  related_ids: number[];
  rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  attributes: ProductAttribute[];
  variations?: number[];
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image?: {
    id: number;
    src: string;
    name: string;
    alt: string;
  };
  menu_order: number;
  count: number;
}

// Cart Types
export interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  variation_id?: number;
  attributes?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  tax: number;
  shipping: number;
  discount: number;
}

// Order Types
export interface Order {
  id: number;
  number: string;
  status: OrderStatus;
  date_created: string;
  date_completed?: string;
  total: string;
  subtotal: string;
  shipping_total: string;
  tax_total: string;
  discount_total: string;
  currency: string;
  payment_method: string;
  line_items: OrderLineItem[];
  billing: Address;
  shipping: Address;
}

export interface OrderLineItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: string;
}

export type OrderStatus = 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';

// Address Types
export interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

// Customer Types
export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string;
  billing: Address;
  shipping: Address;
}

// Review Types
export interface Review {
  id: number;
  product_id: number;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  date_created: string;
}

// Coupon Types
export interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  amount: string;
  description: string;
}

// Auth Types
export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pages: number;
  current_page: number;
}

export interface ApiError {
  code: string;
  message: string;
  data?: Record<string, any>;
}

// Filter Types
export interface ProductFilters {
  category?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  orderby?: 'popularity' | 'rating' | 'date' | 'price' | 'price-desc';
  per_page?: number;
  page?: number;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'order_update' | 'promotion' | 'general';
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}
