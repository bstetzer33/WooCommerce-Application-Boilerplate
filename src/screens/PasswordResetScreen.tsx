import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@constants/index';

export const PasswordResetScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.title}>Reset Password</Text>
        </View>

        {step === 'email' && (
          <View style={styles.form}>
            <Text style={styles.subtitle}>Enter your email address to receive a reset code</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setStep('code')}>
              <Text style={styles.buttonText}>Send Reset Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'code' && (
          <View style={styles.form}>
            <Text style={styles.subtitle}>Enter the code sent to your email</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reset Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={setCode}
                maxLength={6}
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setStep('password')}>
              <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'password' && (
          <View style={styles.form}>
            <Text style={styles.subtitle}>Enter your new password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.LG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.MD,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.LG,
  },
  buttonText: {
    color: COLORS.BACKGROUND_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
