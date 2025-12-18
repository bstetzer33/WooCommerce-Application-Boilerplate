import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { COLORS, SPACING } from '@constants/index';
import { getInitials } from '@utils/helpers';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode, notificationsEnabled, setNotificationsEnabled } = useUIStore();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          logout();
        },
        style: 'destructive',
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.LG }]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {getInitials(user.first_name, user.last_name)}
          </Text>
        </View>
        <Text style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Menu Sections */}

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="account-edit"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Address Book</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="heart"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Wishlist</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="package-multiple"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Order History</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name={isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny'}
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: COLORS.GRAY_LIGHT, true: COLORS.PRIMARY }}
            thumbColor={COLORS.BACKGROUND_LIGHT}
          />
        </View>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="bell"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.GRAY_LIGHT, true: COLORS.PRIMARY }}
            thumbColor={COLORS.BACKGROUND_LIGHT}
          />
        </View>
      </View>

      {/* Help Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="help-circle"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Help Center</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="file-document"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Terms & Conditions</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="shield"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <MaterialCommunityIcons
          name="logout"
          size={20}
          color={COLORS.ERROR}
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  header: {
    alignItems: 'center',
    paddingBottom: SPACING.XL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    marginHorizontal: SPACING.LG,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  avatar: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_LIGHT,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginTop: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.MD,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.LG,
    marginTop: SPACING.XL,
    marginBottom: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    borderRadius: 8,
  },
  logoutIcon: {
    marginRight: SPACING.SM,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.ERROR,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.LG,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  text: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: SPACING.XL,
  },
});
