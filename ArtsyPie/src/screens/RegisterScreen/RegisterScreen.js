import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';
import styles from './RegisterScreen.styles';
import { clearMessage } from '../../redux/slices/authSlice';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  // Xử lý khi đăng ký thành công
  useEffect(() => {
  if (success === 'Đăng ký thành công') {
    navigation.replace('LoginScreen');     
    dispatch(clearMessage());            
  }
}, [success]);

  // Xử lý khi có lỗi
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleRegister = () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
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
    
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!agreeToTerms) {
      alert('Vui lòng đồng ý với Điều khoản & Dịch vụ');
      return;
    }

    // Log payload để debug
    const payload = {
      fullName: name,
      email,
      password,
      confirmPassword,
      acceptTerms: agreeToTerms
    };
    console.log('Register payload:', payload);

   dispatch(register(payload)).then((res) => {
  console.log('Kết quả dispatch register:', res);
});

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the art world</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <View style={styles.termsContainer}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={() => setAgreeToTerms(!agreeToTerms)}
        >
          <View style={[styles.checkboxInner, agreeToTerms && styles.checkboxChecked]}>
            {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          Tôi đồng ý với{' '}
          <Text style={styles.termsLink}>Điều khoản & Dịch vụ</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
          {loading ? 'Đang đăng ký...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}

      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.replace('LoginScreen')}>
          Sign In
        </Text>
      </Text>
    </View>
  );
}
