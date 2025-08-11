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
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
// import * as ImagePicker from 'expo-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { updateLocalProfile } from '../../redux/slices/authSlice';
import styles from './EditProfileScreen.styles';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });

  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const originalData = {
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || '',
      bio: user?.bio || '',
    };

    const hasFormChanges = Object.keys(formData).some(
      key => {
        const currentValue = formData[key] || '';
        const originalValue = originalData[key] || '';
        return currentValue.trim() !== originalValue.trim();
      }
    );

    const hasImageChanges = profileImage !== (user?.avatar || null);

    setHasChanges(hasFormChanges || hasImageChanges);
  }, [formData, profileImage, user]);

  // Update form data when user data changes (e.g., after successful update)
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        bio: user.bio || '',
      });
      setProfileImage(user.avatar || null);
    }
  }, [user]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark that there are changes
    setHasChanges(true);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      updateFormData('dateOfBirth', date.toISOString().split('T')[0]);
      // Mark that there are changes
      setHasChanges(true);
    }
  };

  const pickImageFromCamera = async () => {
    try {
      // Placeholder for camera functionality - will be implemented when expo-image-picker is installed
      Alert.alert('Coming Soon', 'Camera functionality will be available once expo-image-picker is installed');
      setShowImagePickerModal(false);
      // Mark that there are changes when user attempts to change image
      setHasChanges(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      // Placeholder for gallery functionality - will be implemented when expo-image-picker is installed
      Alert.alert('Coming Soon', 'Gallery functionality will be available once expo-image-picker is installed');
      setShowImagePickerModal(false);
      // Mark that there are changes when user attempts to change image
      setHasChanges(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simple validation
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Update local state directly (không gọi API)
      const updatedUser = {
        ...user,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth,
        address: formData.address.trim(),
        bio: formData.bio.trim(),
      };
      
      // Update Redux store
      dispatch(updateLocalProfile(updatedUser));
      
      // Show success message
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Edit Profile</Text>
      <TouchableOpacity
        onPress={handleSave}
        style={[styles.headerButton, styles.saveButton, !hasChanges && styles.disabledButton]}
        disabled={loading}
      >
        <Text style={[styles.saveText, !hasChanges && styles.disabledText]}>
          {loading ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfileImage = () => (
    <View style={styles.profileImageSection}>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={() => setShowImagePickerModal(true)}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={60} color="#ccc" />
          </View>
        )}
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      <Text style={styles.imageHint}>Tap to change profile photo</Text>
    </View>
  );

  const renderFormField = (label, field, placeholder, multiline = false, keyboardType = 'default') => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        autoCapitalize={field === 'email' ? 'none' : 'sentences'}
      />
    </View>
  );

  const renderDateField = () => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>Date of Birth</Text>
      <TextInput
        style={styles.textInput}
        placeholder="YYYY-MM-DD (e.g., 1990-01-15)"
        placeholderTextColor="#999"
        value={formData.dateOfBirth}
        onChangeText={(value) => updateFormData('dateOfBirth', value)}
        keyboardType="numeric"
      />
    </View>
  );

  const renderImagePickerModal = () => (
    <Modal
      visible={showImagePickerModal}
      transparent
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Profile Photo</Text>
          
          <TouchableOpacity style={styles.modalButton} onPress={pickImageFromCamera}>
            <Ionicons name="camera-outline" size={24} color="#333" />
            <Text style={styles.modalButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
            <Ionicons name="image-outline" size={24} color="#333" />
            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          {profileImage && (
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setProfileImage(null);
                setShowImagePickerModal(false);
              }}
            >
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
              <Text style={[styles.modalButtonText, { color: '#FF6B6B' }]}>Remove Photo</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowImagePickerModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileImage()}
        
        <View style={styles.formContainer}>
          {renderFormField('Full Name', 'fullName', 'Enter your full name')}
          {renderFormField('Email', 'email', 'Enter your email', false, 'email-address')}
          {renderFormField('Phone', 'phone', 'Enter your phone number', false, 'phone-pad')}
          {renderDateField()}
          {renderFormField('Address', 'address', 'Enter your address', true)}
          {renderFormField('Bio', 'bio', 'Tell us about yourself', true)}
        </View>
      </ScrollView>



      {renderImagePickerModal()}
    </SafeAreaView>
  );
}
