import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './AddressBookScreen.styles';
import { COLORS } from '../../theme/colors';

export default function AddressBookScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Mock addresses data - in real app this would come from Redux state
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      fullName: 'John Doe',
      phone: '0123456789',
      address: '123 Main St, Anytown, USA 12345',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      fullName: 'John Doe',
      phone: '0123456789',
      address: '456 Business Ave, Worktown, USA 67890',
      isDefault: false,
    },
    {
      id: '3',
      name: 'Apartment',
      fullName: 'John Doe',
      phone: '0123456789',
      address: '2551 Vista Dr #B301, Juneau, Alaska 99801',
      isDefault: false,
    },
  ]);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const handleAddAddress = () => {
    navigation.navigate('NewAddressScreen', {
      mode: 'add',
      onAddressAdded: (newAddress) => {
        setAddresses(prev => [...prev, { ...newAddress, id: Date.now().toString() }]);
      }
    });
  };

  const handleEditAddress = (address) => {
    navigation.navigate('NewAddressScreen', {
      mode: 'edit',
      address: address,
      onAddressUpdated: (updatedAddress) => {
        setAddresses(prev => 
          prev.map(addr => 
            addr.id === updatedAddress.id ? updatedAddress : addr
          )
        );
      }
    });
  };

  const handleSetDefault = (addressId) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
  };

  const handleDeleteAddress = (address) => {
    if (address.isDefault) {
      Alert.alert(
        'Cannot Delete',
        'You cannot delete your default address. Please set another address as default first.',
        [{ text: 'OK' }]
      );
      return;
    }

    setAddressToDelete(address);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete.id));
      setDeleteModalVisible(false);
      setAddressToDelete(null);
    }
  };

  const renderAddressItem = (address) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressInfo}>
          <View style={styles.addressNameRow}>
            <Text style={styles.addressName}>{address.name}</Text>
          </View>
          <Text style={styles.fullName}>{address.fullName}</Text>
          <Text style={styles.phone}>{address.phone}</Text>
          <Text style={styles.address}>{address.address}</Text>
        </View>
        
        <View style={styles.addressActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAddress(address)}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteAddress(address)}
          >
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
      
      {!address.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(address.id)}
        >
          <Text style={styles.setDefaultButtonText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDeleteModal = () => (
    <Modal
      visible={deleteModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setDeleteModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons name="warning" size={24} color="#dc3545" />
            <Text style={styles.modalTitle}>Delete Address</Text>
          </View>
          
          <Text style={styles.modalMessage}>
            Are you sure you want to delete this address? This action cannot be undone.
          </Text>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={confirmDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
        <Text style={styles.headerTitle}>Address Book</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Addresses</Text>
            <Text style={styles.emptyMessage}>
              You haven't added any addresses yet. Add your first address to get started.
            </Text>
          </View>
        ) : (
          <View style={styles.addressesList}>
            {addresses.map(renderAddressItem)}
          </View>
        )}
      </ScrollView>

      {/* Add Address Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={handleAddAddress}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addAddressButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {renderDeleteModal()}
    </SafeAreaView>
  );
} 