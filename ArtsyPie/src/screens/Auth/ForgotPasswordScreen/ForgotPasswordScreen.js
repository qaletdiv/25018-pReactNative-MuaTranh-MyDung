import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from './ForgotPasswordScreen.styles';
import { validateEmail } from '../../../utils/validateEmail';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearMessage } from '../../../redux/slices/authSlice';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const isEmailValid = validateEmail(email);

  useEffect(() => {
    // Xóa thông báo cũ khi vào màn hình
    dispatch(clearMessage());
  }, []);

  useEffect(() => {
    if (success === 'Yêu cầu đã được gửi') {
      navigation.navigate('VerificationCodeScreen', { email });
      dispatch(clearMessage());
    }
    if (error) {
      Alert.alert('Lỗi', error);
      dispatch(clearMessage());
    }
  }, [success, error]);

  const handleSendEmail = () => {
    if (!isEmailValid) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    dispatch(forgotPassword(email));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>


          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email for the verification process.{"\n"}
            We will send a 4-digit code to your email.
          </Text>

          <Text style={styles.label}>Email</Text>
          <View style={[
            styles.inputWrapper,
            email.length > 0 && (isEmailValid ? styles.inputValid : styles.inputInvalid)
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
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

          <TouchableOpacity
            style={[styles.button, !isEmailValid && styles.buttonDisabled]}
            onPress={handleSendEmail}
            disabled={!isEmailValid || loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Đang gửi...' : 'Gửi mã'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
