export const API_BASE_URL = process.env.EXPO_PUBLIC_WOOCOMMERCE_API_URL || 'https://your-store.com/wp-json/wc/v3';
export const CONSUMER_KEY = process.env.EXPO_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || '';
export const CONSUMER_SECRET = process.env.EXPO_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || '';
export const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000', 10);

export const SCREENS = {
  // Auth Screens
  AUTH_STACK: 'AuthStack',
  LOGIN: 'Login',
  REGISTER: 'Register',
  PASSWORD_RESET: 'PasswordReset',
  
  // Main Screens
  MAIN_STACK: 'MainStack',
  HOME: 'Home',
  CATEGORIES: 'Categories',
  CART: 'Cart',
  PROFILE: 'Profile',
  
  // Product Screens
  PRODUCT_DETAILS: 'ProductDetails',
  PRODUCT_LIST: 'ProductList',
  SEARCH: 'Search',
  
  // Checkout Screens
  CHECKOUT_STACK: 'CheckoutStack',
  SHIPPING_ADDRESS: 'ShippingAddress',
  PAYMENT_METHOD: 'PaymentMethod',
  CHECKOUT_REVIEW: 'CheckoutReview',
  ORDER_CONFIRMATION: 'OrderConfirmation',
  
  // Profile Screens
  ORDER_HISTORY: 'OrderHistory',
  ORDER_DETAILS: 'OrderDetails',
  ADDRESS_BOOK: 'AddressBook',
  SETTINGS: 'Settings',
  EDIT_PROFILE: 'EditProfile',
  WISHLIST: 'Wishlist',
  
  // Admin Screens
  ADMIN_DASHBOARD: 'AdminDashboard',
  PRODUCT_MANAGEMENT: 'ProductManagement',
};

export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5AC8FA',
  SUCCESS: '#4CD964',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  GRAY_LIGHT: '#F2F2F7',
  GRAY_MEDIUM: '#C7C7CC',
  GRAY_DARK: '#8E8E93',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  BACKGROUND_LIGHT: '#FFFFFF',
  BACKGROUND_DARK: '#1C1C1E',
  BORDER: '#E5E5EA',
};

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 32,
};

export const RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  FULL: 9999,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  CART: 'cart_data',
  WISHLIST: 'wishlist_items',
  RECENT_SEARCHES: 'recent_searches',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

export const PAGINATION = {
  PER_PAGE: 20,
  PAGE_SIZE: 20,
};

export const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Latest', value: 'date' },
  { label: 'Lowest Price', value: 'price' },
  { label: 'Highest Price', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
];

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  FAILED: 'failed',
};

export const LANGUAGE_CODES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  PT: 'pt',
};
