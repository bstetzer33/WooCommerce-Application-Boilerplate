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
import { Formik } from 'formik';
import * as yup from 'yup';
import apiClient from '@services/api';
import { useAuthStore } from '@store/authStore';
import { COLORS, SPACING } from '@constants/index';
import { isValidEmail } from '@utils/helpers';
import { handleApiError } from '@utils/errorHandler';
import { Toast } from '@components/Toast';
import { LoadingSpinner } from '@components/LoadingSpinner';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .test('valid-email', 'Invalid email format', (value) => !value || isValidEmail(value)),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const { login, setLoading, setError } = useAuthStore();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await apiClient.loginWithEmail(values.email, values.password);
      const { user, token } = response.data;

      await login(user, token);
      setToastMessage('Login successful');
      setToastType('success');
    } catch (error) {
      const err = handleApiError(error);
      setToastMessage(err.message);
      setToastType('error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, touched.email && errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                  editable={!isSubmitting}
                  accessibilityLabel="Email input"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, touched.password && errors.password && styles.inputError]}
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  secureTextEntry
                  editable={!isSubmitting}
                  accessibilityLabel="Password input"
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('PasswordReset')}
                accessible
                accessibilityLabel="Forgot password button"
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessible
                accessibilityLabel="Login button"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" color={COLORS.BACKGROUND_LIGHT} />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onDismiss={() => setToastMessage(null)}
        />
      )}
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
    marginTop: SPACING.XL,
    marginBottom: SPACING.XXL,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
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
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: SPACING.XS,
  },
  forgotPassword: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: SPACING.LG,
  },
  loginButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.LG,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.BACKGROUND_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.LG,
  },
  footerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  signUpLink: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
