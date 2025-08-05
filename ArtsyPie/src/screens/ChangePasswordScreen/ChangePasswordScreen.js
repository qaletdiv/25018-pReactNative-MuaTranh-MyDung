import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import styles from './ChangePasswordScreen.styles';
import { COLORS } from '../../theme/colors';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Here you would typically dispatch an action to change password
      // dispatch(changePassword(formData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderPasswordField = (label, field, placeholder) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.passwordInput,
            errors[field] && styles.textInputError
          ]}
          value={formData[field]}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, [field]: text }));
            if (errors[field]) {
              setErrors(prev => ({ ...prev, [field]: '' }));
            }
          }}
          placeholder={placeholder}
          secureTextEntry={!showPasswords[field]}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => togglePasswordVisibility(field)}
        >
          <Ionicons
            name={showPasswords[field] ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderPasswordStrength = () => {
    if (!formData.newPassword) return null;

    const strength = {
      length: formData.newPassword.length >= 8,
      uppercase: /[A-Z]/.test(formData.newPassword),
      lowercase: /[a-z]/.test(formData.newPassword),
      number: /\d/.test(formData.newPassword),
    };

    const strengthScore = Object.values(strength).filter(Boolean).length;
    const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][strengthScore - 1] || 'Weak';
    const strengthColor = ['#dc3545', '#ffc107', '#17a2b8', '#28a745'][strengthScore - 1] || '#dc3545';

    return (
      <View style={styles.strengthContainer}>
        <Text style={styles.strengthLabel}>Password Strength:</Text>
        <Text style={[styles.strengthText, { color: strengthColor }]}>
          {strengthText}
        </Text>
        <View style={styles.strengthBar}>
          <View style={[styles.strengthBarFill, { 
            width: `${(strengthScore / 4) * 100}%`,
            backgroundColor: strengthColor
          }]} />
        </View>
        <View style={styles.strengthCriteria}>
          <Text style={[styles.criteriaText, strength.length && styles.criteriaMet]}>
            ✓ At least 8 characters
          </Text>
          <Text style={[styles.criteriaText, strength.uppercase && styles.criteriaMet]}>
            ✓ One uppercase letter
          </Text>
          <Text style={[styles.criteriaText, strength.lowercase && styles.criteriaMet]}>
            ✓ One lowercase letter
          </Text>
          <Text style={[styles.criteriaText, strength.number && styles.criteriaMet]}>
            ✓ One number
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          {renderPasswordField('Current Password', 'currentPassword', 'Enter your current password')}
          {renderPasswordField('New Password', 'newPassword', 'Enter your new password')}
          {renderPasswordStrength()}
          {renderPasswordField('Confirm New Password', 'confirmPassword', 'Confirm your new password')}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Password Requirements</Text>
          </View>
          <Text style={styles.infoText}>
            Your password must be at least 8 characters long and contain:
          </Text>
          <Text style={styles.infoText}>• At least one uppercase letter</Text>
          <Text style={styles.infoText}>• At least one lowercase letter</Text>
          <Text style={styles.infoText}>• At least one number</Text>
        </View>

        <TouchableOpacity
          style={[styles.changeButton, isLoading && styles.changeButtonDisabled]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.changeButtonText}>Changing Password...</Text>
          ) : (
            <Text style={styles.changeButtonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 