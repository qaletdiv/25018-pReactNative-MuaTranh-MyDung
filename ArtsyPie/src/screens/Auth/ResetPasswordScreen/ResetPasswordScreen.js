import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './ResetPasswordScreen.styles';
import { validatePassword } from '../../../utils/validatePassword';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearMessage } from '../../../redux/slices/authSlice';

export default function ResetPasswordScreen({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const { email } = route.params; // Nhận email từ màn hình trước

  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid =
    confirmPassword.length > 0 && confirmPassword === password;
    
  useEffect(() => {
    dispatch(clearMessage());
  }, []);

  useEffect(() => {
    if (success === 'Mật khẩu đã được thay đổi thành công') {
      setShowSuccessModal(true);
      dispatch(clearMessage());
    }
    if (error) {
      Alert.alert('Lỗi', error);
      dispatch(clearMessage());
    }
  }, [success, error]);

  const handleContinue = () => {
    if (!isPasswordValid || !isConfirmPasswordValid) return;
    
    dispatch(resetPassword({ email, password }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Set the new password for your account so you can login and access all the features.
          </Text>

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
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {!isPasswordValid && password.length > 0 && (
            <Text style={styles.errorText}>
              Password must include uppercase, lowercase, number, special character and be at least 8 characters
            </Text>
          )}

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              style={styles.icon}
            >
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {!isConfirmPasswordValid && confirmPassword.length > 0 && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

          {/* Continue button */}
          <TouchableOpacity
            style={[
              styles.button,
              (!isPasswordValid || !isConfirmPasswordValid || loading) ? styles.buttonDisabled : null,
            ]}
            onPress={handleContinue}
            disabled={!isPasswordValid || !isConfirmPasswordValid || loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Tiếp tục'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal success */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconWrapper}>
              <Ionicons name="checkmark-circle" size={50} color="green" />
            </View>
            <Text style={styles.modalTitle}>Password Changed!</Text>
            <Text style={styles.modalMessage}>
              You can now use your new password to login to your account.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('LoginScreen');
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
