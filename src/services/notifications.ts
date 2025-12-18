import * as Notifications from 'expo-notifications';
import { Notification } from '@types/index';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  registerForPushNotifications: async (): Promise<string | null> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);
      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },

  sendLocalNotification: async (notification: Notification): Promise<void> => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  },

  scheduleNotification: async (
    notification: Notification,
    delayInSeconds: number
  ): Promise<void> => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
        },
        trigger: {
          seconds: delayInSeconds,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  },

  dismissAllNotifications: async (): Promise<void> => {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error dismissing notifications:', error);
    }
  },

  addNotificationListener: (callback: (notification: any) => void) => {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  removeNotificationListener: (subscription: any) => {
    if (subscription) {
      subscription.remove();
    }
  },
};
