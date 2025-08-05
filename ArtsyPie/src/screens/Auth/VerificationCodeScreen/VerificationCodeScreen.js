// screens/VerificationCodeScreen/VerificationCodeScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './VerificationCodeScreen.styles';

export default function VerificationCodeScreen({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleContinue = () => {
    const fullCode = code.join('');
    if (fullCode.length === 4) {
      // TODO: Verify OTP here
      navigation.replace('ResetPasswordScreen');
    }
  };

  const isCodeValid = code.join('').length === 4;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Back button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* Title & subtitle */}
            <Text style={styles.title}>Enter 4 Digit Code</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit code sent to{' '}
              <Text style={styles.boldText}>{route.params?.email || 'your email'}</Text>.
            </Text>

            {/* Code Inputs */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                />
              ))}
            </View>

            {/* Resend */}
            <Text style={styles.resendText}>
              Didn’t receive the code? <Text style={styles.resendLink}>Resend</Text>
            </Text>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.button, !isCodeValid && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={!isCodeValid}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
