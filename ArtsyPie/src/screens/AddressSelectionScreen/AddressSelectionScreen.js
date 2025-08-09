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
import styles from './AddressSelectionScreen.styles';
import { COLORS } from '../../theme/colors';

export default function AddressSelectionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Nhận địa chỉ hiện tại từ CheckoutScreen
  const currentSelectedAddress = route.params?.currentSelectedAddress;
  
  const [selectedAddress, setSelectedAddress] = useState(() => {
    // Nếu có địa chỉ hiện tại từ Checkout, sử dụng nó, không thì default đầu tiên
    return currentSelectedAddress?.id || null;
  });

  // Mock addresses - chỉ dùng local state
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



  // Nhận địa chỉ mới hoặc đã update từ NewAddressScreen
  useEffect(() => {
    const newAddress = route.params?.newAddress;
    const updatedAddress = route.params?.updatedAddress;
    
    if (newAddress) {
  
      setAddresses(prev => {
        let updated = [...prev];
        
        if (newAddress.isDefault) {
          updated = updated.map(addr => ({ ...addr, isDefault: false }));
        }
        
        updated.push(newAddress);

        return updated;
      });
      
      // Nếu là default, chọn địa chỉ mới
      if (newAddress.isDefault) {
        setSelectedAddress(newAddress.id);
      }
    }
    
    if (updatedAddress) {
  
      setAddresses(prev => {
        let updated = prev.map(addr => {
          if (addr.id === updatedAddress.id) {
            return updatedAddress;
          }
          if (updatedAddress.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });
        

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

  // Set selected address khi addresses load xong
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses, selectedAddress]);

  // Cập nhật selectedAddress khi addresses thay đổi và địa chỉ hiện tại không tồn tại
  useEffect(() => {
    const currentAddressExists = addresses.find(addr => addr.id === selectedAddress);
    if (!currentAddressExists && addresses.length > 0) {
      // Nếu địa chỉ hiện tại không tồn tại, chọn địa chỉ đầu tiên
      setSelectedAddress(addresses[0].id);
    }
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

  const handleAddressDelete = async (address) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa địa chỉ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            // Chỉ xóa khỏi local state
            setAddresses(prev => prev.filter(addr => addr.id !== address.id));
            Alert.alert('Success', 'Address deleted successfully');
          }
        }
      ]
    );
  };

  const handleAddNewAddress = () => {
    navigation.navigate('NewAddressScreen');
  };

  const handleApply = () => {
    // Lấy địa chỉ đã chọn
    const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
    
    // Đảm bảo địa chỉ có đầy đủ thông tin cần thiết
    const addressToPass = {
      ...selectedAddressData,
      name: selectedAddressData?.name || selectedAddressData?.fullName || 'Unknown',
      fullName: selectedAddressData?.fullName || selectedAddressData?.name || 'Unknown',
      phone: selectedAddressData?.phone || '0123456789',
    };
    
    // Chỉ truyền địa chỉ đã chọn, KHÔNG truyền delivery time để tránh conflict
    navigation.navigate('Checkout', { 
      selectedAddress: addressToPass
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
            </View>
            <Text style={styles.addressText}>{address.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.addressActions}>
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
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleAddressDelete(address)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
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