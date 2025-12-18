import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { RootNavigator } from '@navigation/RootNavigator';
import { NotificationService } from '@services/notifications';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      // Register for push notifications
      await NotificationService.registerForPushNotifications();

      // Hide the splash screen
      await SplashScreen.hideAsync();
    };

    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <Toast />
      <StatusBar barStyle="dark-content" />
    </SafeAreaProvider>
  );
}
