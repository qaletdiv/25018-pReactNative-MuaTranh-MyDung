// RegisterScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearMessage } from '../../redux/slices/authSlice';
import styles from './RegisterScreen.styles';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isNameValid = name.trim().length > 0;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && agreeToTerms;

  // Google 
  const [googleRequest, googleResponse, promptGoogleSignIn] = Google.useAuthRequest({
    expoClientId: '507408054427-1p6p6v7v7v7v7v7v7v7v7v7v7v7v7v7.apps.googleusercontent.com',
    androidClientId: '507408054427-1p6p6v7v7v7v7v7v7v7v7v7v7v7v7v7.apps.googleusercontent.com', 
  });

  // Facebook 
  const [fbRequest, fbResponse, promptFacebookSignIn] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID', 
  });

  useEffect(() => {
    // Xóa lỗi khi người dùng rời màn hình
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(clearMessage());
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (success === 'Đăng ký thành công') {
      Alert.alert('Thành công', 'Tài khoản của bạn đã được tạo.', [
        { text: 'OK', onPress: () => navigation.replace('LoginScreen') }
      ]);
      dispatch(clearMessage());
    }
    if (error) {
      Alert.alert('Đăng ký thất bại', error);
      dispatch(clearMessage()); // Xóa lỗi ngay sau khi hiển thị
    }
  }, [success, error]);

  // Handle Google login 
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      navigation.replace('HomeScreen');
    }
  }, [googleResponse]);

  // Handle Facebook login 
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      navigation.replace('HomeScreen');
    }
  }, [fbResponse]);

  const handleRegister = () => {
    if (!isFormValid) return;
    const payload = { fullName: name, email, password, confirmPassword, acceptTerms: agreeToTerms };
    dispatch(register(payload));
  };

  const handleGoogleLogin = () => {
    promptGoogleSignIn();
  };

  const handleFacebookLogin = () => {
    promptFacebookSignIn();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>Let's create your account.</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.inputWithIcon,
            name.length > 0 && (isNameValid ? styles.inputValid : styles.inputInvalid)
          ]}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        {name.length > 0 && (
          <View style={styles.iconWrapper}>
            <Ionicons name={isNameValid ? 'checkmark-circle' : 'alert-circle'} size={20} color={isNameValid ? 'green' : 'red'} />
          </View>
        )}
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.inputWithIcon,
            email.length > 0 && (isEmailValid ? styles.inputValid : styles.inputInvalid)
          ]}
          placeholder="Enter your email address"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {email.length > 0 && (
          <View style={styles.iconWrapper}>
            <Ionicons name={isEmailValid ? 'checkmark-circle' : 'alert-circle'} size={20} color={isEmailValid ? 'green' : 'red'} />
          </View>
        )}
      </View>
      {!isEmailValid && email.length > 0 && (
        <Text style={styles.errorText}>Please enter a valid email address</Text>
      )}

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.inputWithIcon,
            password.length > 0 && (isPasswordValid ? styles.inputValid : styles.inputInvalid)
          ]}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconWrapper}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {!isPasswordValid && password.length > 0 && (
        <Text style={styles.errorText}>Password must include uppercase, lowercase, number, special char and be at least 8 characters</Text>
      )}

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.inputWithIcon,
            confirmPassword.length > 0 && (isConfirmPasswordValid ? styles.inputValid : styles.inputInvalid)
          ]}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.iconWrapper}>
          <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {!isConfirmPasswordValid && confirmPassword.length > 0 && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}

      {/* Terms */}
      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={() => setAgreeToTerms(!agreeToTerms)}>
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
            {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By signing up you agree to our{' '}
          <Text style={styles.termsLink}>Terms, Privacy Policy</Text> and{' '}
          <Text style={styles.termsLink}>Cookie Use</Text>
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!isFormValid || loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create an Account'}</Text>
      </TouchableOpacity>

      {/* OR */}
      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.orLine} />
      </View>

      {/* Social buttons */}
      <TouchableOpacity style={styles.socialButtonWhite} onPress={handleGoogleLogin}>
        <Image source={require('../../../assets/Images/google.png')} style={styles.socialIcon} />
        <Text style={styles.socialTextBlack}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButtonBlue} onPress={handleFacebookLogin}>
        <Image source={require('../../../assets/Images/facebook.png')} style={styles.socialIcon} />
        <Text style={styles.socialTextWhite}>Sign Up with Facebook</Text>
      </TouchableOpacity>

      {/* Bottom */}
      <View>
        <Text style={styles.bottomText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.replace('LoginScreen')}>
            Log In
          </Text>
        </Text>
      </View>
    </View>
  );
}
