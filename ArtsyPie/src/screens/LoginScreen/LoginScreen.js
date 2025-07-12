import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './LoginScreen.styles';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  // Xử lý khi đăng nhập thành công
  useEffect(() => {
    if (success) {
      navigation.replace('HomeScreen');
    }
  }, [success, navigation]);

  // Xử lý khi có lỗi
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleLogin = () => {
    // Validation
    if (!email || !password) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!validateEmail(email)) {
      alert('Email không đúng định dạng');
      return;
    }

    if (!validatePassword(password)) {
      alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.replace('RegisterScreen')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
}
