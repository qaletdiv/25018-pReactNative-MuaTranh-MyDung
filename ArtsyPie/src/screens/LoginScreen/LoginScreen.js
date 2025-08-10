import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import styles from './LoginScreen.styles';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearMessage } from '../../redux/slices/authSlice';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearMessage());
  }, []);

  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isFormValid = isEmailValid && isPasswordValid;

  // Google Auth
  const [googleRequest, googleResponse, promptGoogleSignIn] = Google.useAuthRequest({
    expoClientId: '507408054427-1p6p6v7v7v7v7v7v7v7v7v7v7v7v7v7.apps.googleusercontent.com',
    androidClientId: '507408054427-1p6p6v7v7v7v7v7v7v7v7v7v7v7v7v7.apps.googleusercontent.com', 
  });

  // Facebook 
  const [fbRequest, fbResponse, promptFacebookSignIn] = Facebook.useAuthRequest({
    clientId: '', 
  });

  useEffect(() => {
    // Xóa lỗi khi người dùng rời màn hình
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(clearMessage());
    });

    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    if (success) {
      navigation.replace('MainTabs');
      dispatch(clearMessage());
    }
    if (error) {
      Alert.alert('Đăng nhập thất bại', error);
      dispatch(clearMessage()); // Xóa lỗi ngay sau khi hiển thị
    }
  }, [success, error]);

  // Handle Google login response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      // Lấy thông tin user từ Google API 
      navigation.replace('HomeScreen');
    }
  }, [googleResponse]);

  // Handle Facebook login response
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      // Lấy thông tin user từ Facebook API 
      navigation.replace('HomeScreen');
    }
  }, [fbResponse]);

  const handleLogin = () => {
    if (!isFormValid) return;
    dispatch(login({ email, password }));
  };

  const handleGoogleLogin = () => {
    promptGoogleSignIn();
  };

  const handleFacebookLogin = () => {
    promptFacebookSignIn();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Login to your account</Text>
        <Text style={styles.subtitle}>It's great to see you again.</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input]}
            placeholder="Enter your email address"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {email.length > 0 && (
            isEmailValid ? (
              <Ionicons name="checkmark-circle" size={20} color="green" />
            ) : (
              <Ionicons name="alert-circle" size={20} color="red" />
            )
          )}
        </View>
        {!isEmailValid && email.length > 0 && (
          <Text style={styles.errorText}>Please enter valid email address</Text>
        )}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        {!isPasswordValid && password.length > 0 && (
          <Text style={styles.errorText}>Password must be at least 8 characters with upper, lower, number and symbol</Text>
        )}

        {/* Forgot Password */}
        <Text style={styles.forgotText}>
          Forgot your password?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('ResetPasswordScreen')}>
              Reset your password
          </Text>
        </Text>

        {/* Login button */}
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isFormValid || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Login'}</Text>
        </TouchableOpacity>

        {/* Or separator */}
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.orLine} />
        </View>

        {/* Social Buttons */}
        <TouchableOpacity style={styles.socialButtonWhite} onPress={handleGoogleLogin}>
          <Image source={require('../../../assets/Images/google.png')} style={styles.socialIcon} />
          <Text style={styles.socialTextBlack}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButtonBlue} onPress={handleFacebookLogin}>
          <Image source={require('../../../assets/Images/facebook.png')} style={styles.socialIcon} />
          <Text style={styles.socialTextWhite}>Login with Facebook</Text>
        </TouchableOpacity>

        {/* Bottom text */}
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={styles.bottomText}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.replace('RegisterScreen')}>
              Join
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
