import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import { COLORS, SCREENS } from '@constants/index';

// Import Screens
import { LoginScreen } from '@screens/LoginScreen';
import { RegisterScreen } from '@screens/RegisterScreen';
import { HomeScreen } from '@screens/HomeScreen';
import { CategoriesScreen } from '@screens/CategoriesScreen';
import { CartScreen } from '@screens/CartScreen';
import { ProfileScreen } from '@screens/ProfileScreen';
import { ProductDetailsScreen } from '@screens/ProductDetailsScreen';
import { SearchScreen } from '@screens/SearchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack
const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.BACKGROUND_LIGHT },
      }}
    >
      <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
      <Stack.Screen name={SCREENS.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Home Stack
const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_LIGHT,
          borderBottomColor: COLORS.BORDER,
          borderBottomWidth: 1,
        },
        headerTintColor: COLORS.PRIMARY,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.PRODUCT_DETAILS}
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
};

// Categories Stack
const CategoriesStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_LIGHT,
          borderBottomColor: COLORS.BORDER,
          borderBottomWidth: 1,
        },
        headerTintColor: COLORS.PRIMARY,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen
        name={SCREENS.PRODUCT_DETAILS}
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
};

// Main Bottom Tab Navigator
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND_LIGHT,
          borderTopColor: COLORS.BORDER,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoriesStack"
        component={CategoriesStack}
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-grid" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.SEARCH}
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.CART}
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation
export const RootNavigator: React.FC = () => {
  const { isAuthenticated, restoreToken } = useAuthStore();
  const [isBoot, setIsBoot] = React.useState(false);

  React.useEffect(() => {
    const bootstrap = async () => {
      await restoreToken();
      setIsBoot(true);
    };

    bootstrap();
  }, [restoreToken]);

  if (!isBoot) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              backgroundColor: COLORS.BACKGROUND_LIGHT,
            },
            drawerActiveTintColor: COLORS.PRIMARY,
          }}
        >
          <Drawer.Screen
            name={SCREENS.MAIN_STACK}
            component={MainTabNavigator}
            options={{ title: 'Shop' }}
          />
        </Drawer.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
