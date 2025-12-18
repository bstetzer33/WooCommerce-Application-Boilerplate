# WooCommerce Expo React Native Mobile Application

A comprehensive, production-ready boilerplate for building a cross-platform mobile e-commerce application using Expo, React Native, and TypeScript. This app integrates seamlessly with WooCommerce stores via REST API.

## 🚀 Features

### Core E-Commerce Features
- ✅ **User Authentication**: Registration, login, password reset, and profile management
- ✅ **Product Browsing**: Categorized product lists, detailed product pages with images and specifications
- ✅ **Search & Filters**: Advanced search with autocomplete, price filtering, ratings, and sorting
- ✅ **Shopping Cart**: Add/remove items, quantity updates, persistent storage
- ✅ **Checkout Process**: Multi-step checkout with shipping and billing addresses
- ✅ **Order Management**: Order history, tracking, and order details
- ✅ **Wishlist/Favorites**: Save products for later purchase
- ✅ **Product Reviews**: View and submit reviews with ratings
- ✅ **Coupon Support**: Apply discount codes at checkout

### Advanced Features
- ✅ **Push Notifications**: Order updates and promotional alerts via Expo Notifications
- ✅ **Dark/Light Theme**: System-aware theming with manual toggle
- ✅ **Internationalization**: Multi-language support (English, Spanish, French, German, Portuguese)
- ✅ **Offline Support**: Local caching for products and categories
- ✅ **User Profile**: Edit profile, manage addresses and payment methods
- ✅ **Settings**: Notification preferences, language selection, account management
- ✅ **Performance**: Image caching, lazy loading, and optimized rendering
- ✅ **Security**: Secure token storage with Expo SecureStore
- ✅ **Error Handling**: Comprehensive error management and user feedback
- ✅ **Accessibility**: ARIA labels, voiceover support, and keyboard navigation

## 📋 Project Structure

```
WooCommerce-Application-Boilerplate/
├── App.tsx                          # Root component
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── jest.config.js                   # Testing config
├── .env.example                     # Environment variables template
│
├── src/
│   ├── components/                  # Reusable UI components
│   ├── screens/                     # Screen components
│   ├── navigation/                  # Navigation configuration
│   ├── services/                    # API and external services
│   ├── store/                       # Zustand state management
│   ├── hooks/                       # Custom React hooks
│   ├── utils/                       # Utility functions
│   ├── constants/                   # App constants
│   ├── types/                       # TypeScript type definitions
│   └── assets/                      # Static assets
│
└── __tests__/                       # Test files
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)

### 1. Clone and Install

```bash
git clone <repository-url>
cd WooCommerce-Application-Boilerplate
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your WooCommerce store details:

```env
EXPO_PUBLIC_WOOCOMMERCE_API_URL=https://your-store.com/wp-json/wc/v3
EXPO_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key_here
EXPO_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret_here
```

### 3. Generate WooCommerce API Keys

1. Log in to WooCommerce admin panel
2. Navigate to **Settings** → **Advanced** → **REST API**
3. Create API key with **Read/Write** permissions
4. Copy the keys to `.env`

### 4. Start Development

```bash
npm start           # Start dev server
npm run ios         # iOS simulator
npm run android     # Android emulator
npm run web         # Web browser
```

## 🧪 Testing & Linting

```bash
npm test            # Run tests
npm run lint        # Check code
npm run lint:fix    # Fix lint errors
npm run format      # Format code
```

## 📦 Building for Production

### iOS Build

```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

### Android Build

```bash
eas build --platform android
```

## 📚 Key Features

### State Management (Zustand)
- Authentication state management
- Shopping cart persistence
- Wishlist management
- UI/Theme preferences

### API Integration
- WooCommerce REST API client with interceptors
- Automatic token refresh
- Error handling and retry logic
- Secure token storage

### Navigation
- Bottom tab navigation
- Stack navigation for deep linking
- Drawer menu for secondary navigation

### Components
- Reusable product cards
- Loading spinners and error displays
- Toast notifications
- Form validation (Formik + Yup)

## 🔐 Security

- Secure token storage with Expo SecureStore
- OAuth 1.0a and JWT authentication support
- HTTPS only API calls
- Automatic token refresh on 401 responses
- Input validation with Formik + Yup

## 🌐 WooCommerce API Integration

Supports all major WooCommerce REST API endpoints:
- Products and categories
- Customer management
- Orders and checkout
- Product reviews
- Coupons and discounts

## 🎨 Customization

### Themes & Colors
Edit colors in `src/constants/index.ts`

### Adding New Screens
1. Create screen in `src/screens/`
2. Add to navigation in `src/navigation/RootNavigator.tsx`

### Custom API Methods
Add to `src/services/api.ts` and create corresponding hooks

## 🐛 Troubleshooting

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Expo Go crashes:**
```bash
rm -rf ~/.expo
npm start --clear
```

**API returns 401:**
- Verify API keys in `.env`
- Ensure API keys are Active in WooCommerce admin
- Check REST API is enabled in WooCommerce settings

## 📖 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [React Navigation](https://reactnavigation.org)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## ✅ Requirements

### WooCommerce Setup
- REST API enabled
- API keys with Read/Write permissions
- HTTPS enabled
- CORS headers configured
- Optional: JWT Authentication plugin

### Client Requirements
- iOS 11.0+
- Android 5.0+ (API level 21)
- 50MB storage minimum

## 📄 License

MIT License - See LICENSE file for details.

---

**Happy coding! 🚀**
