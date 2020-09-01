import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import navigationNames from '@/navigation/navigationNames';
import { useNavigation } from '@react-navigation/native';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PageLoader, Button, MyTextInput } from '@/components';
import { colors } from '@/theme';
import { AuthService } from '@/services';
import { useAuth, useToast } from '@/store';
import { AuthLink, AuthSocial } from './components';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setSubmitting(true);
      const { user, token } = await AuthService.login(
        email.toLowerCase(),
        password
      );
      await login(user, token);
      navigation.navigate(navigationNames.profileTab);
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const LoginSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password is too Short!')
      .required('Password is Required'),
    email: Yup.string().email('Invalid email').required('Email is Required'),
  });

  return (
    <View style={styles.container}>
      <PageLoader visible={submitting} />
      <Formik
        validationSchema={LoginSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values) => handleLogin(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={styles.group}>
              <MyTextInput
                label="Email"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <ErrorMessage name="email">
                {(msg) => (
                  <View style={styles.errorContainer}>
                    <Text style={styles.error}>{msg}</Text>
                  </View>
                )}
              </ErrorMessage>
            </View>
            <View style={styles.group}>
              <MyTextInput
                label="Password"
                style={styles.input}
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <ErrorMessage name="password">
                {(msg) => (
                  <View style={styles.errorContainer}>
                    <Text style={styles.error}>{msg}</Text>
                  </View>
                )}
              </ErrorMessage>
            </View>
            <View style={styles.group}>
              <Button title="Log In" onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
      <AuthLink type="login" />
      <AuthSocial />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 20,
  },
  group: {
    marginVertical: 10,
  },
  input: {
    height: 45,
    borderColor: colors.dark,
    borderBottomWidth: 1,
  },
  errorContainer: {
    paddingTop: 5,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
  },
});
