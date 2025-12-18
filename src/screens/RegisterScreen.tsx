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
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .test('valid-email', 'Invalid email format', (value) => !value || isValidEmail(value)),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const { login, setLoading, setError } = useAuthStore();

  const handleRegister = async (values: any) => {
    try {
      setLoading(true);
      const response = await apiClient.registerUser({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      });

      const { user, token } = response.data;
      await login(user, token);
      setToastMessage('Registration successful');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start shopping</Text>
        </View>

        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={[styles.input, touched.first_name && errors.first_name && styles.inputError]}
                    placeholder="First name"
                    value={values.first_name}
                    onChangeText={handleChange('first_name')}
                    editable={!isSubmitting}
                  />
                  {touched.first_name && errors.first_name && (
                    <Text style={styles.errorText}>{errors.first_name}</Text>
                  )}
                </View>

                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={[styles.input, touched.last_name && errors.last_name && styles.inputError]}
                    placeholder="Last name"
                    value={values.last_name}
                    onChangeText={handleChange('last_name')}
                    editable={!isSubmitting}
                  />
                  {touched.last_name && errors.last_name && (
                    <Text style={styles.errorText}>{errors.last_name}</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, touched.email && errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                  editable={!isSubmitting}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, touched.password && errors.password && styles.inputError]}
                  placeholder="Create a password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  secureTextEntry
                  editable={!isSubmitting}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, touched.confirm_password && errors.confirm_password && styles.inputError]}
                  placeholder="Confirm your password"
                  value={values.confirm_password}
                  onChangeText={handleChange('confirm_password')}
                  secureTextEntry
                  editable={!isSubmitting}
                />
                {touched.confirm_password && errors.confirm_password && (
                  <Text style={styles.errorText}>{errors.confirm_password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.signUpButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" color={COLORS.BACKGROUND_LIGHT} />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Log In</Text>
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
    marginBottom: SPACING.LG,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: SPACING.LG,
  },
  halfInput: {
    width: '48%',
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
  signUpButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.LG,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
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
  loginLink: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
