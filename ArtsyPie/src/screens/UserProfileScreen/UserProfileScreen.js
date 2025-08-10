import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './UserProfileScreen.styles';
import { COLORS } from '../../theme/colors';

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Here you would typically dispatch an action to update user profile
      // dispatch(updateUserProfile(formData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK' }]
      );
      
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: user?.address || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../../assets/Images/avatar.jpg')}
          style={styles.avatar}
        />
        {isEditing && (
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.userName}>{formData.fullName || 'User Name'}</Text>
      <Text style={styles.userEmail}>{formData.email || 'user@example.com'}</Text>
    </View>
  );

  const renderFormField = (label, field, placeholder, keyboardType = 'default', multiline = false) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          errors[field] && styles.textInputError,
          multiline && styles.textInputMultiline
        ]}
        value={formData[field]}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, [field]: text }));
          if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
          }
        }}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        editable={isEditing}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderGenderSelector = () => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>Gender</Text>
      <View style={styles.genderContainer}>
        {['Male', 'Female', 'Other'].map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              styles.genderOption,
              formData.gender === gender && styles.genderOptionSelected
            ]}
            onPress={() => {
              if (isEditing) {
                setFormData(prev => ({ ...prev, gender }));
              }
            }}
            disabled={!isEditing}
          >
            <Text style={[
              styles.genderOptionText,
              formData.gender === gender && styles.genderOptionTextSelected
            ]}>
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      {isEditing ? (
        <>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => setIsEditing(true)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // const renderMenuItems = () => (
  //   <View style={styles.menuSection}>
  //     <TouchableOpacity
  //       style={styles.menuItem}
  //       onPress={handleChangePassword}
  //     >
  //       <View style={styles.menuItemLeft}>
  //         <Ionicons name="lock-closed-outline" size={20} color="#666" />
  //         <Text style={styles.menuItemText}>Change Password</Text>
  //       </View>
  //       <Ionicons name="chevron-forward" size={20} color="#ccc" />
  //     </TouchableOpacity>

  //     <TouchableOpacity
  //       style={styles.menuItem}
  //       onPress={() => navigation.navigate('Notification')}
  //     >
  //       <View style={styles.menuItemLeft}>
  //         <Ionicons name="notifications-outline" size={20} color="#666" />
  //         <Text style={styles.menuItemText}>Notification Settings</Text>
  //       </View>
  //       <Ionicons name="chevron-forward" size={20} color="#ccc" />
  //     </TouchableOpacity>

  //     <TouchableOpacity
  //       style={styles.menuItem}
  //       onPress={() => navigation.navigate('PrivacyPolicy')}
  //     >
  //       <View style={styles.menuItemLeft}>
  //         <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
  //         <Text style={styles.menuItemText}>Privacy Policy</Text>
  //       </View>
  //       <Ionicons name="chevron-forward" size={20} color="#ccc" />
  //     </TouchableOpacity>

  //     <TouchableOpacity
  //       style={styles.menuItem}
  //       onPress={() => navigation.navigate('TermsOfService')}
  //     >
  //       <View style={styles.menuItemLeft}>
  //         <Ionicons name="document-text-outline" size={20} color="#666" />
  //         <Text style={styles.menuItemText}>Terms of Service</Text>
  //       </View>
  //       <Ionicons name="chevron-forward" size={20} color="#ccc" />
  //     </TouchableOpacity>
  //   </View>
  // );

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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}

        <View style={styles.formSection}>
          {renderFormField('Full Name', 'fullName', 'Enter your full name')}
          {renderFormField('Email', 'email', 'Enter your email', 'email-address')}
          {renderFormField('Phone', 'phone', 'Enter your phone number', 'phone-pad')}
          {renderFormField('Date of Birth', 'dateOfBirth', 'MM/DD/YYYY')}
          {renderGenderSelector()}
          {renderFormField('Address', 'address', 'Enter your address', 'default', true)}
        </View>

        {renderActionButtons()}
      </ScrollView>
    </SafeAreaView>
  );
} 