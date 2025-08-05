import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CheckoutScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { COLORS } from '../../theme/colors';
import { fetchArtworks } from '../../redux/slices/artworksSlice';
import { clearCartAsync } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/ordersSlice';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const { artworks } = useSelector((state) => state.artworks);

  // Load artworks data when component mounts
  React.useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  // Nhận cart data từ CartScreen
  const cartDataFromRoute = route.params?.cartItems;
  const subtotalFromRoute = route.params?.subtotal;
  const vatFromRoute = route.params?.vat;
  const totalWithoutShippingFromRoute = route.params?.totalWithoutShipping;
  
  //chỉ update khi có params mới
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('fast');
  const [promoCode, setPromoCode] = useState('');

  // Sử dụng cart data từ route nếu có, không thì dùng từ Redux
  const currentCartItems = cartDataFromRoute || cartItems;

  // Chỉ update khi có params mới từ navigation
  useEffect(() => {
    if (route.params?.selectedAddress?.id && route.params.selectedAddress.id !== selectedAddress) {
      setSelectedAddress(route.params.selectedAddress.id);
    }
  }, [route.params?.selectedAddress?.id, selectedAddress]);

  useEffect(() => {
    if (route.params?.selectedDeliveryTime?.id && route.params.selectedDeliveryTime.id !== selectedDeliveryTime) {
      setSelectedDeliveryTime(route.params.selectedDeliveryTime.id);
    }
  }, [route.params?.selectedDeliveryTime?.id, selectedDeliveryTime]);

  //  addresses data
  const addresses = [
    { id: 'home', name: 'Home', address: '123 Main St, Anytown, USA 12345', isDefault: true },
    { id: 'office', name: 'Office', address: '456 Business Ave, Worktown, USA 67890', isDefault: false },
    { id: 'apartment', name: 'Apartment', address: '2551 Vista Dr #B301, Juneau, Alaska 99801', isDefault: false, },
    { id: 'parents', name: "Parent's House", address: '4821 Ridge Top Cir, Anchorage, Alaska 99504', isDefault: false, },
  ];

  //  payment methods data
  const paymentMethods = [
    {
      id: 'card',
      name: 'Card',
      icon: 'card-outline',
    },
    {
      id: 'cash',
      name: 'Cash',
      icon: 'cash-outline',
    },
    {
      id: 'pay',
      name: 'Pay',
      icon: 'wallet-outline',
    },
  ];

  //  data cards
  const savedCards = [
    {
      id: 'visa1',
      type: 'VISA',
      number: '**** **** **** 2612',
      isDefault: true,
    },
    {
      id: 'visa2',
      type: 'VISA',
      number: '**** **** **** 2512',
      isDefault: false,
    },
  ];

  const deliveryOptions = [
    {
      id: 'fast',
      name: 'Fast',
      description: 'Guaranteed delivery within 2 hours',
      time: '2 hours',
      price: 50000,
    },
    {
      id: 'express',
      name: 'Express',
      description: 'Express delivery in 4 hours',
      time: '4 hours',
      price: 30000,
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Standard delivery in 1-2 days',
      time: '1-2 days',
      price: 15000,
    },
    {
      id: 'economy',
      name: 'Economy',
      description: 'Economy delivery in 3-5 days',
      time: '3-5 days',
      price: 8000,
    },
  ];

  const calculateSubtotal = () => {
    // Sử dụng subtotal từ route params, không thì tính từ cart items
    if (subtotalFromRoute !== undefined) {
      return subtotalFromRoute;
    }
    
    return currentCartItems.reduce((total, item) => {
      // Sử dụng product data từ cart item (đã có từ API)
      const itemTotal = (item.product?.price || 0) * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const calculateVAT = () => {
    // Sử dụng VAT từ route params, không thì tính 10% của subtotal
    if (vatFromRoute !== undefined) {
      return vatFromRoute;
    }
    
    return calculateSubtotal() * 0.1;
  };

  const calculateDelivery = () => {
    const selectedDelivery = deliveryOptions.find(d => d.id === selectedDeliveryTime);
    return selectedDelivery?.price || 0;
  };

  const calculateTotal = () => {
    // Sử dụng totalWithoutShipping từ route params, không thì tính
    const baseTotal = totalWithoutShippingFromRoute !== undefined 
      ? totalWithoutShippingFromRoute 
      : calculateSubtotal() + calculateVAT();
    
    return baseTotal + calculateDelivery();
  };

  const handlePlaceOrder = async () => {
    try {
      // Lấy địa chỉ hiện tại từ route params hoặc từ addresses array
      const currentAddress = route.params?.selectedAddress || addresses.find(a => a.id === selectedAddress);
      const selectedDelivery = deliveryOptions.find(d => d.id === selectedDeliveryTime);
      const selectedPayment = paymentMethods.find(p => p.id === selectedPayment);
      
      // Tạo order data cho API
      const orderData = {
        total: calculateTotal(),
        products: currentCartItems.map(item => ({
          id: item.productId || item.id,
          name: item.product?.name || 'Unknown Product',
          image: item.product?.image,
          price: item.product?.price || 0,
          quantity: item.quantity,
          size: item.selectedOptions?.size || 'Standard',
          options: `${item.selectedOptions?.size || 'Standard'}, ${item.selectedOptions?.frame || 'No Frame'}`
        })),
        address: currentAddress,
        paymentMethod: selectedPayment,
        deliveryTime: selectedDelivery,
        shippingMethod: selectedDelivery
      };

      // Gọi API tạo order
      const result = await dispatch(createOrder(orderData)).unwrap();
      
      // Navigate đến OrderConfirmation với data từ API
      navigation.navigate('OrderConfirmation', {
        orderId: result.id,
        total: result.total,
        subtotal: calculateSubtotal(),
        items: currentCartItems,
        selectedAddress: currentAddress,
        selectedPayment: selectedPayment,
        selectedDeliveryTime: selectedDelivery,
        selectedShippingMethod: selectedDelivery,
      });
      
      // Clear cart sau khi tạo order thành công
      await dispatch(clearCartAsync()).unwrap();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const renderDeliveryAddress = () => {
    // Tìm địa chỉ hiện tại từ route params hoặc từ addresses array
    const currentAddress = route.params?.selectedAddress || addresses.find(a => a.id === selectedAddress);
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => navigation.navigate('AddressSelection', {
              currentSelectedAddress: currentAddress
            })}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addressCard}>
          <View style={styles.addressInfo}>
            <View style={styles.addressHeader}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.addressName}>{currentAddress?.name}</Text>
            </View>
            <Text style={styles.addressText}>{currentAddress?.address}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDeliveryTime = () => {
    const selectedDelivery = deliveryOptions.find(d => d.id === selectedDeliveryTime);
    const currentAddress = route.params?.selectedAddress || addresses.find(a => a.id === selectedAddress);
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shipping & Delivery</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('DeliveryTimeSelection', {
              currentAddress: currentAddress,
              currentDeliveryTime: selectedDeliveryTime
            })}
          >
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {/* Chỉ hiển thị option đang được chọn */}
        <TouchableOpacity
          style={styles.deliveryOption}
          onPress={() => navigation.navigate('DeliveryTimeSelection', {
            currentAddress: currentAddress,
            currentDeliveryTime: selectedDeliveryTime
          })}
        >
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryHeader}>
              <Text style={styles.deliveryName}>
                {selectedDelivery?.name}
              </Text>
              <Text style={styles.deliveryPrice}>
                {formatCurrency(selectedDelivery?.price || 0)}
              </Text>
            </View>
            <Text style={styles.deliveryDescription}>
              {selectedDelivery?.description}
            </Text>
            <Text style={styles.deliveryTime}>
              {selectedDelivery?.time}
            </Text>
          </View>
          
          <View style={styles.deliveryRadio}>
            <View style={styles.deliveryRadioDot} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPaymentMethod = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentOptions}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              selectedPayment === method.id && styles.selectedPaymentOption,
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <Ionicons 
              name={method.icon} 
              size={20} 
              color={selectedPayment === method.id ? COLORS.primary : '#666'} 
            />
            <Text style={[
              styles.paymentOptionText,
              selectedPayment === method.id && styles.selectedPaymentOptionText,
            ]}>
              {method.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedPayment === 'card' && (
        <View style={styles.savedCard}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardType}>VISA</Text>
            <Text style={styles.cardNumber}>**** **** **** 2512</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub-total:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>VAT (10%):</Text>
          <Text style={styles.summaryValue}>{formatCurrency(calculateVAT())}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery fee:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(calculateDelivery())}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(calculateTotal())}</Text>
        </View>
        
        <View style={styles.promoSection}>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter promo code"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.addPromoButton}>
            <Text style={styles.addPromoButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderDeliveryAddress()}
        {renderDeliveryTime()}
        {renderPaymentMethod()}
        {renderOrderSummary()}
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}