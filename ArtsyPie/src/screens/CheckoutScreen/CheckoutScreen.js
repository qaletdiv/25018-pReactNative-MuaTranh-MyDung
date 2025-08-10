import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CheckoutScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { COLORS } from '../../theme/colors';
import { fetchArtworks } from '../../redux/slices/artworksSlice';
import { clearCartAsync } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/ordersSlice';
import { fetchAddressesAsync } from '../../redux/slices/addressesSlice';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const { artworks } = useSelector((state) => state.artworks);
  const { addresses: userAddresses } = useSelector((state) => state.addresses);
  const { user } = useSelector((state) => state.auth);

  // Load artworks data when component mounts
  React.useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchAddressesAsync());
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

  const availableAddresses = userAddresses.length > 0 ? userAddresses : [
    { id: 'home', name: 'Home', address: '123 Main St, Anytown, USA 12345', isDefault: true },
    { id: 'office', name: 'Office', address: '456 Business Ave, Worktown, USA 67890', isDefault: false },
    { id: 'apartment', name: 'Apartment', address: '2551 Vista Dr #B301, Juneau, Alaska 99801', isDefault: false, },
    { id: 'parents', name: "Parent's House", address: '4821 Ridge Top Cir, Anchorage, Alaska 99504', isDefault: false, },
  ];

  useEffect(() => {
    if (!selectedAddress || selectedAddress === '') {
      const defaultAddress = availableAddresses.find(addr => addr.isDefault) || availableAddresses[0];
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    }
  }, [availableAddresses, selectedAddress]);

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
      const currentAddress = route.params?.selectedAddress || availableAddresses.find(a => a.id === selectedAddress);
      const selectedDelivery = deliveryOptions.find(d => d.id === selectedDeliveryTime);
      const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);
      
      const orderData = {
        items: currentCartItems.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          product: {
            id: item.productId || item.id,
            name: item.product?.name || 'Unknown Product',
            price: item.product?.price || 0,
            image: item.product?.image,
            artist: item.product?.artist || 'Unknown Artist',
            description: item.product?.description || 'No description'
          },
          selectedOptions: {
            size: item.selectedOptions?.size || 'Standard',
            frame: item.selectedOptions?.frame || 'No Frame'
          }
        })),
        shippingAddress: {
          fullName: currentAddress?.fullName || currentAddress?.name || 'Unknown',
          phone: currentAddress?.phone || '0123456789',
          email: user?.email || currentAddress?.email || 'user@example.com',
          address: currentAddress?.address || currentAddress?.streetAddress || 'Unknown Address',
          city: currentAddress?.city || 'Unknown City',
          district: currentAddress?.district || currentAddress?.state || 'Unknown District',
          ward: currentAddress?.ward || currentAddress?.city || 'Unknown Ward',
          zipCode: currentAddress?.zipCode || currentAddress?.postalCode || '000000',
          note: currentAddress?.note || currentAddress?.additionalInfo || ''
        },
        paymentMethod: {
          type: selectedPaymentMethod?.id || 'cod',
          method: selectedPaymentMethod?.name || 'Thanh toán khi nhận hàng'
        },
        totalAmount: calculateTotal()
      };

      //Log dữ liệu được gửi đi
      //console.log('Order data being sent:', JSON.stringify(orderData, null, 2));

      // Validation: Kiểm tra dữ liệu trước khi gửi
      if (!orderData.items || orderData.items.length === 0) {
        //console.error('No items in order');
        return;
      }

      if (!orderData.shippingAddress || !orderData.paymentMethod || !orderData.totalAmount) {
        console.error('Missing required order data');
        return;
      }

      const result = await dispatch(createOrder(orderData)).unwrap();
      
       navigation.navigate('OrderConfirmation', {
         orderId: result.id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
         total: result.total || calculateTotal(),
         subtotal: calculateSubtotal(),
         items: currentCartItems,
         selectedAddress: currentAddress || {
           name: 'Unknown',
           address: 'Unknown Address',
           phone: '0123456789',
           email: 'user@example.com'
         },
         selectedPayment: selectedPaymentMethod,
         selectedDeliveryTime: selectedDelivery,
         selectedShippingMethod: selectedDelivery,
       });
      
      await dispatch(clearCartAsync()).unwrap();
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert(
        'Lỗi tạo đơn hàng',
        error.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderDeliveryAddress = () => {
    // Tìm địa chỉ hiện tại từ route params hoặc từ addresses array
    const currentAddress = route.params?.selectedAddress || availableAddresses.find(a => a.id === selectedAddress);
    
    //  log để kiểm tra
    // console.log('CheckoutScreen - selectedAddress:', selectedAddress);
    // console.log('CheckoutScreen - currentAddress:', currentAddress);
    // console.log('CheckoutScreen - availableAddresses:', availableAddresses);
    
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
              <Text style={styles.addressName}>
                {currentAddress?.name || currentAddress?.fullName || 'Home'}
              </Text>
            </View>
            <Text style={styles.addressText}>
              {currentAddress?.address || '123 Main St, Anytown, USA 12345'}
            </Text>
          </View>
        </View>
        
        {/* Cart Items Preview */}
        <View style={styles.cartItemsPreview}>
          <Text style={styles.cartItemsTitle}>Items in Cart ({currentCartItems.length})</Text>
          {currentCartItems.slice(0, 3).map((item, index) => (
            <View key={`${item.id}_${index}`} style={styles.cartItemPreview}>
              <Image 
                source={item.product?.image ? 
                  (typeof item.product.image === 'string' && item.product.image.startsWith('http') 
                    ? { uri: item.product.image } 
                    : item.product.image)
                  : require('../../../assets/Images/Product/plus1.jpg')
                } 
                style={styles.cartItemImage} 
              />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.product?.name || 'Unknown Product'}</Text>
                <Text style={styles.cartItemArtist}>{item.product?.artist || 'Unknown Artist'}</Text>
                <Text style={styles.cartItemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.cartItemPrice}>
                {formatCurrency((item.product?.price || 0) * item.quantity)}
              </Text>
            </View>
          ))}
          {currentCartItems.length > 3 && (
            <Text style={styles.moreItemsText}>+{currentCartItems.length - 3} more items</Text>
          )}
        </View>
      </View>
    );
  };

  const renderDeliveryTime = () => {
    const selectedDelivery = deliveryOptions.find(d => d.id === selectedDeliveryTime);
    const currentAddress = route.params?.selectedAddress || availableAddresses.find(a => a.id === selectedAddress);
    
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
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>{formatCurrency(calculateSubtotal() * 1.05)}</Text>
            <Text style={styles.discountedPrice}>{formatCurrency(calculateSubtotal())}</Text>
          </View>
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