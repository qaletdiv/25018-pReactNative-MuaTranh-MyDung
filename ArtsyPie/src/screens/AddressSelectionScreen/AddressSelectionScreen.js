import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AddressSelectionScreen.styles';
import { COLORS } from '../../theme/colors';

export default function AddressSelectionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // Nhận địa chỉ hiện tại từ CheckoutScreen
  const currentSelectedAddress = route.params?.currentSelectedAddress;
  
  const [selectedAddress, setSelectedAddress] = useState(() => {
    // Nếu có địa chỉ hiện tại từ Checkout, sử dụng nó, không thì default 'home'
    return currentSelectedAddress?.id || 'home';
  });

  // Mock addresses - in real app, this would come from Redux/API
  const [addresses, setAddresses] = useState([
    {
      id: 'home',
      name: 'Home',
      address: '925 S Chugach St #APT 10, Alaska 99645',
      isDefault: true,
    },
    {
      id: 'office',
      name: 'Office',
      address: '2438 6th Ave, Ketchikan, Alaska 99601',
      isDefault: false,
    },
    {
      id: 'apartment',
      name: 'Apartment',
      address: '2551 Vista Dr #B301, Juneau, Alaska 99801',
      isDefault: false,
    },
    {
      id: 'parents',
      name: "Parent's House",
      address: '4821 Ridge Top Cir, Anchorage, Alaska 99504',
      isDefault: false,
    },
  ]);

  // Load addresses từ AsyncStorage khi component mount
  useEffect(() => {
    loadAddressesFromStorage();
  }, []);

  // Load addresses từ AsyncStorage
  const loadAddressesFromStorage = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        console.log('📱 Loaded addresses from storage:', parsedAddresses);
      }
    } catch (error) {
      console.log('❌ Error loading addresses:', error);
    }
  };

  // Save addresses vào AsyncStorage
  const saveAddressesToStorage = async (newAddresses) => {
    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(newAddresses));
      console.log('💾 Saved addresses to storage:', newAddresses);
    } catch (error) {
      console.log('❌ Error saving addresses:', error);
    }
  };

  // Nhận địa chỉ mới hoặc đã update từ NewAddressScreen
  useEffect(() => {
    const newAddress = route.params?.newAddress;
    const updatedAddress = route.params?.updatedAddress;
    
    if (newAddress) {
      console.log('🆕 Adding new address:', newAddress);
      setAddresses(prev => {
        let updated = [...prev];
        
        // Nếu địa chỉ mới là default, xóa default của tất cả địa chỉ khác
        if (newAddress.isDefault) {
          updated = updated.map(addr => ({ ...addr, isDefault: false }));
        }
        
        updated.push(newAddress);
        console.log('📝 Updated addresses list:', updated);
        
        // Lưu vào AsyncStorage
        saveAddressesToStorage(updated);
        
        return updated;
      });
      
      // Nếu là default, chọn địa chỉ mới
      if (newAddress.isDefault) {
        setSelectedAddress(newAddress.id);
      }
    }
    
    if (updatedAddress) {
      console.log('✏️ Updating address:', updatedAddress);
      setAddresses(prev => {
        let updated = prev.map(addr => {
          if (addr.id === updatedAddress.id) {
            return updatedAddress;
          }
          // Nếu địa chỉ này được set default, xóa default của địa chỉ khác
          if (updatedAddress.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });
        
        console.log('📝 Updated addresses list after edit:', updated);
        
        // Lưu vào AsyncStorage
        saveAddressesToStorage(updated);
        
        return updated;
      });
      
      // Nếu là default, chọn địa chỉ đã update
      if (updatedAddress.isDefault) {
        setSelectedAddress(updatedAddress.id);
      }
    }
  }, [route.params?.newAddress, route.params?.updatedAddress]);

  // Clear params sau khi xử lý để tránh duplicate
  useEffect(() => {
    if (route.params?.newAddress || route.params?.updatedAddress) {
      setTimeout(() => {
        navigation.setParams({ 
          newAddress: undefined, 
          updatedAddress: undefined 
        });
      }, 100);
    }
  }, [route.params?.newAddress, route.params?.updatedAddress, navigation]);

  // Cập nhật selectedAddress khi addresses thay đổi và địa chỉ hiện tại không tồn tại
  useEffect(() => {
    const currentAddressExists = addresses.find(addr => addr.id === selectedAddress);
    if (!currentAddressExists && addresses.length > 0) {
      // Nếu địa chỉ hiện tại không tồn tại, chọn địa chỉ đầu tiên
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  // Debug: Kiểm tra addresses state
  useEffect(() => {
    console.log('=== ADDRESSES STATE DEBUG ===');
    console.log('Current addresses:', addresses);
    console.log('Selected address:', selectedAddress);
  }, [addresses, selectedAddress]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handleAddressEdit = (address) => {
    // Mở NewAddressScreen với data để edit
    navigation.navigate('NewAddressScreen', { 
      editAddress: address 
    });
  };

  const handleAddNewAddress = () => {
    navigation.navigate('NewAddressScreen');
  };

  const handleApply = () => {
    // Lấy địa chỉ đã chọn
    const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
    
    // Chỉ truyền địa chỉ đã chọn, KHÔNG truyền delivery time để tránh conflict
    navigation.navigate('Checkout', { 
      selectedAddress: selectedAddressData
      // Không truyền selectedDeliveryTime để tránh reset delivery time
    });
  };

  const renderAddressItem = (address) => (
    <View key={address.id} style={styles.addressItem}>
      <TouchableOpacity
        style={styles.addressContent}
        onPress={() => handleAddressEdit(address)}
      >
        <View style={styles.addressHeader}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <View style={styles.addressInfo}>
            <View style={styles.addressNameRow}>
              <Text style={styles.addressName}>{address.name}</Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.addressText}>{address.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.radioButton}
        onPress={() => handleAddressSelect(address.id)}
      >
        <View style={[
          styles.radioCircle,
          selectedAddress === address.id && styles.radioCircleSelected
        ]}>
          {selectedAddress === address.id && (
            <View style={styles.radioDot} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Saved Addresses</Text>
        
        {addresses.map(renderAddressItem)}
        
        <TouchableOpacity 
          style={styles.addNewButton}
          onPress={handleAddNewAddress}
        >
          <Ionicons name="add" size={20} color={COLORS.primary} />
          <Text style={styles.addNewButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 