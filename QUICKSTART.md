# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd WooCommerce-Application-Boilerplate
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env with your WooCommerce credentials
```

### Step 3: Start the App
```bash
npm start
```

### Step 4: Open in Simulator
```bash
# iOS
npm run ios

# Android
npm run android
```

### Step 5: Test Login
Use any email/password to test the login flow (API connection required)

## 📝 Project Overview

This is a **production-ready** e-commerce mobile application boilerplate with:

### ✅ Implemented Features
- Complete authentication system (Login, Register, Password Reset)
- Product browsing with categories
- Advanced search functionality
- Shopping cart with persistent storage
- Wishlist management
- User profile and settings
- Order management screens (UI structure)
- Product reviews and ratings
- Push notification support
- Dark/Light theme toggle
- Comprehensive error handling
- Type-safe codebase (TypeScript)

### 📦 Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **API Client**: Axios
- **Forms**: Formik + Yup
- **Testing**: Jest
- **Linting**: ESLint + Prettier

### 🔌 Backend Integration
The app is ready to connect to any WooCommerce store with:
- OAuth 1.0a authentication
- JWT token support
- Automatic token refresh
- Secure credential storage

## 📁 Project Structure

```
src/
├── components/       → Reusable UI components
├── screens/          → Full screen components
├── navigation/       → Navigation config
├── services/         → API & external services
├── store/            → Zustand state stores
├── hooks/            → Custom React hooks
├── utils/            → Helper functions
├── constants/        → App constants
└── types/            → TypeScript definitions
```

## 🎯 Key Files to Customize

1. **API Configuration**: `src/services/api.ts`
2. **Color Theme**: `src/constants/index.ts` (COLORS)
3. **App Navigation**: `src/navigation/RootNavigator.tsx`
4. **Environment**: `.env` (WooCommerce credentials)

## 🧪 Development Commands

```bash
# Development
npm start              # Start dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # Web browser

# Testing & Linting
npm test               # Run tests
npm run lint           # Check code
npm run lint:fix       # Fix issues
npm run format         # Format code
npm run type-check     # TypeScript check

# Production
eas build --platform ios      # Build iOS
eas build --platform android  # Build Android
```

## 🔑 WooCommerce API Setup

1. **Enable REST API** in WooCommerce settings
2. **Create API Key** with Read/Write permissions
3. **Copy credentials** to `.env` file:
   ```
   EXPO_PUBLIC_WOOCOMMERCE_API_URL=https://yourstore.com/wp-json/wc/v3
   EXPO_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
   EXPO_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
   ```

## 💡 Pro Tips

1. **Hot Reload**: Changes auto-reload in development
2. **Debugging**: Use React Native Debugger or Flipper
3. **Network**: Use Expo's network inspector to debug API calls
4. **TypeScript**: Full type safety prevents runtime errors
5. **Testing**: Run tests before deploying

## ⚠️ Important Notes

- Never commit `.env` file (it's in .gitignore)
- Always use HTTPS for API calls
- Keep dependencies updated for security
- Test on real devices before production
- Implement custom auth endpoints if needed

## 📚 Next Steps

1. **Connect to WooCommerce**: Update API configuration
2. **Customize Branding**: Edit colors and constants
3. **Add Custom Screens**: Follow existing screen patterns
4. **Implement Payments**: Add Stripe/PayPal (optional)
5. **Build & Deploy**: Use EAS for app store submission

## 🆘 Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [Expo docs](https://docs.expo.dev)
- Check [WooCommerce API docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- Review example components in `src/`

## 🎉 You're All Set!

Your WooCommerce mobile app is ready to develop. Start by:

1. Running `npm start`
2. Opening in your preferred simulator
3. Updating `.env` with your store credentials
4. Testing the app flow
5. Customizing for your needs

Happy coding! 🚀
