import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './NewAddressScreen.styles';
import { COLORS } from '../../theme/colors';

export default function NewAddressScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const editAddress = route.params?.editAddress;
  
  const [addressNickname, setAddressNickname] = useState(editAddress?.name || '');
  const [fullAddress, setFullAddress] = useState(editAddress?.address || '');
  const [isDefault, setIsDefault] = useState(editAddress?.isDefault || false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addressNicknames = ['Home', 'Office', 'Apartment', 'Parent\'s House', 'Other'];

  const isFormValid = addressNickname && fullAddress.trim();
  const isEditMode = !!editAddress;

  const handleAddAddress = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (isEditMode) {
        // Update địa chỉ hiện tại 
        const updatedAddress = {
          ...editAddress,
          name: addressNickname,
          address: fullAddress,
          isDefault: isDefault,
        };
        
        // Truyền địa chỉ đã update
        navigation.navigate('AddressSelection', { 
          updatedAddress: updatedAddress 
        });
      } else {
        // Thêm địa chỉ mới 
        const newAddress = {
          id: `address_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: addressNickname,
          address: fullAddress,
          isDefault: isDefault,
        };
        
        // Truyền địa chỉ mới về AddressSelectionScreen
        navigation.navigate('AddressSelection', { 
          newAddress: newAddress 
        });
      }
      
      Alert.alert('Success', isEditMode ? 'Address updated successfully' : 'Address added successfully');
    } catch (error) {
      console.error('NewAddressScreen: Error saving address', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={60} color="#ccc" />
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>Campbell Pl & Lake Otis Pkwy</Text>
      </View>
      <View style={styles.mapPin}>
        <Ionicons name="location" size={24} color={COLORS.primary} />
      </View>
    </View>
  );

  const renderAddressForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{isEditMode ? 'Edit Address' : 'New Address'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Address Nickname</Text>
        <TextInput
          style={styles.textInput}
          value={addressNickname}
          onChangeText={setAddressNickname}
          placeholder="Enter address nickname (e.g., Home, Office, etc.)"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Address</Text>
        <TextInput
          style={styles.textInput}
          value={fullAddress}
          onChangeText={setFullAddress}
          placeholder="Enter your full address..."
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => setIsDefault(!isDefault)}
      >
        <View style={[
          styles.checkbox,
          isDefault && styles.checkboxChecked
        ]}>
          {isDefault && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
        <Text style={styles.checkboxText}>Make this as a default address</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.addButton,
          !isFormValid && styles.addButtonDisabled
        ]}
        onPress={handleAddAddress}
        disabled={!isFormValid}
      >
        <Text style={[
          styles.addButtonText,
          !isFormValid && styles.addButtonTextDisabled
        ]}>
          {isEditMode ? 'Update' : 'Add'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Congratulations!</Text>
          <Text style={styles.successMessage}>Your new address has been added.</Text>
          <TouchableOpacity 
            style={styles.thanksButton}
            onPress={handleSuccessClose}
          >
            <Text style={styles.thanksButtonText}>Thanks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderMapView()}
      {renderAddressForm()}
      {renderSuccessModal()}
    </SafeAreaView>
  );
} 