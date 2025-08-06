import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './DeliveryTimeSelectionScreen.styles';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';

export default function DeliveryTimeSelectionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Nhận địa chỉ hiện tại và delivery time hiện tại từ CheckoutScreen
  const currentAddress = route.params?.currentAddress;
  const currentDeliveryTime = route.params?.currentDeliveryTime;
  
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(() => {
    // Sử dụng delivery time hiện tại nếu có, không thì default 'fast'
    return currentDeliveryTime || 'fast';
  });

  const deliveryOptions = [
    {
      id: 'fast',
      name: 'Fast',
      description: 'Guaranteed delivery within 2 hours',
      time: '2 hours',
      price: 50000,
      icon: 'flash',
    },
    {
      id: 'express',
      name: 'Express',
      description: 'Express delivery in 4 hours',
      time: '4 hours',
      price: 30000,
      icon: 'car',
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Standard delivery in 1-2 days',
      time: '1-2 days',
      price: 15000,
      icon: 'bicycle',
    },
    {
      id: 'economy',
      name: 'Economy',
      description: 'Economy delivery in 3-5 days',
      time: '3-5 days',
      price: 8000,
      icon: 'walk',
    },
  ];

  const handleDeliverySelect = (deliveryId) => {
    setSelectedDeliveryTime(deliveryId);
  };

  const handleApply = () => {
    // Lấy delivery option đã chọn
    const selectedDeliveryData = deliveryOptions.find(option => option.id === selectedDeliveryTime);
    
    // Truyền cả delivery time và current address để giữ nguyên địa chỉ đã chọn
    navigation.navigate('Checkout', { 
      selectedDeliveryTime: selectedDeliveryData,
      selectedAddress: currentAddress // Giữ nguyên địa chỉ hiện tại
    });
  };

  const renderDeliveryOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.deliveryOption,
        selectedDeliveryTime === option.id && styles.selectedDeliveryOption,
      ]}
      onPress={() => handleDeliverySelect(option.id)}
    >
      <View style={styles.deliveryContent}>
        <View style={styles.deliveryHeader}>
          <View style={styles.deliveryIconContainer}>
            <Ionicons 
              name={option.icon} 
              size={24} 
              color={selectedDeliveryTime === option.id ? COLORS.primary : '#666'} 
            />
          </View>
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryNameRow}>
              <Text style={[
                styles.deliveryName,
                selectedDeliveryTime === option.id && styles.selectedDeliveryName,
              ]}>
                {option.name}
              </Text>
              <Text style={[
                styles.deliveryPrice,
                selectedDeliveryTime === option.id && styles.selectedDeliveryPrice,
              ]}>
                {formatCurrency(option.price)}
              </Text>
            </View>
            <Text style={[
              styles.deliveryDescription,
              selectedDeliveryTime === option.id && styles.selectedDeliveryDescription,
            ]}>
              {option.description}
            </Text>
            <Text style={[
              styles.deliveryTime,
              selectedDeliveryTime === option.id && styles.selectedDeliveryTime,
            ]}>
              {option.time}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={[
        styles.radioButton,
        selectedDeliveryTime === option.id && styles.selectedRadioButton,
      ]}>
        {selectedDeliveryTime === option.id && (
          <View style={styles.radioDot} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Time</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Choose Delivery Option</Text>
        
        {deliveryOptions.map(renderDeliveryOption)}
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