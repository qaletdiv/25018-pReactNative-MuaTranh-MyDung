import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './OrderTrackingScreen.styles';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';
const getImageSource = (imageName) => {
  const imageMap = {
    'impressionlsm.jpg': require('../../../assets/Images/Product/impressionlsm.jpg'),
    'modernlsm.jpg': require('../../../assets/Images/Product/modernlsm.jpg'),
    'plus1.jpg': require('../../../assets/Images/Product/plus1.jpg'),
    'plus2.jpg': require('../../../assets/Images/Product/plus2.jpg'),
    'plus3.jpg': require('../../../assets/Images/Product/plus3.jpg'),
    'plus4.jpg': require('../../../assets/Images/Product/plus4.jpg'),
    'pool.jpg': require('../../../assets/Images/Product/pool.jpg'),
    'sportman.jpg': require('../../../assets/Images/Product/sportman.jpg'),
  };
  
  return imageMap[imageName] || require('../../../assets/Images/Product/impressionlsm.jpg');
};

export default function OrderTrackingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;

  const [trackingData, setTrackingData] = useState({
    orderId: orderId,
    status: 'shipping',
    estimatedDelivery: '2025-08-07',
    currentLocation: 'Ho Chi Minh City Distribution Center',
    trackingNumber: 'GH123456789',
    courier: 'Express Delivery',
    courierPhone: '1900-1234',
    timeline: [
      {
        id: '1',
        status: 'Order Placed',
        description: 'Your order has been placed successfully',
        time: '2025-08-05 10:30 AM',
        location: 'Online',
        completed: true,
      },
      {
        id: '2',
        status: 'Order Confirmed',
        description: 'Your order has been confirmed and is being processed',
        time: '2025-08-05 02:15 PM',
        location: 'Warehouse',
        completed: true,
      },
      {
        id: '3',
        status: 'Processing',
        description: 'Your order is being prepared for shipping',
        time: '2025-08-06 09:45 AM',
        location: 'Warehouse',
        completed: true,
      },
      {
        id: '4',
        status: 'Shipped',
        description: 'Your order has been shipped and is on its way',
        time: '2025-08-06 03:20 PM',
        location: 'Ho Chi Minh City Distribution Center',
        completed: true,
      },
      {
        id: '5',
        status: 'In Transit',
        description: 'Your order is currently in transit',
        time: '2025-08-07 08:30 AM',
        location: 'Ho Chi Minh City Distribution Center',
        completed: true,
      },
      {
        id: '6',
        status: 'Out for Delivery',
        description: 'Your order is out for delivery',
        time: 'Expected: 2025-08-07 02:00 PM',
        location: 'Local Delivery Center',
        completed: false,
      },
      {
        id: '7',
        status: 'Delivered',
        description: 'Your order has been delivered',
        time: 'Expected: 2025-08-07 04:00 PM',
        location: 'Your Address',
        completed: false,
      },
    ],
    orderDetails: {
      products: [
        {
          id: '1',
          name: 'Impressionist Landscape',
          image: 'impressionlsm.jpg',
          price: 2500000,
          quantity: 1,
          options: 'Standard, No Frame',
        },
      ],
      total: 2500000,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main St, Anytown, USA 12345',
        phone: '0123456789',
      },
    },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Tracking information updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update tracking information');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContactCourier = () => {
    Alert.alert(
      'Contact Courier',
      `Call ${trackingData.courierPhone} to contact the courier?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {
          Alert.alert('Call', `Calling ${trackingData.courierPhone}`);
        }}
      ]
    );
  };

  const renderOrderHeader = () => (
    <View style={styles.orderHeader}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>Order #{trackingData.orderId}</Text>
        <Text style={styles.trackingNumber}>Tracking: {trackingData.trackingNumber}</Text>
        <Text style={styles.estimatedDelivery}>
          Estimated Delivery: {trackingData.estimatedDelivery}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={isRefreshing}
      >
        <Ionicons 
          name={isRefreshing ? "refresh" : "refresh-outline"} 
          size={24} 
          color={COLORS.primary} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStatus = () => (
    <View style={styles.currentStatusContainer}>
      <View style={styles.statusHeader}>
        <Ionicons name="location" size={24} color={COLORS.primary} />
        <Text style={styles.statusTitle}>Current Status</Text>
      </View>
      <Text style={styles.currentStatus}>{trackingData.status.toUpperCase()}</Text>
      <Text style={styles.currentLocation}>{trackingData.currentLocation}</Text>
      
      <View style={styles.courierInfo}>
        <Text style={styles.courierLabel}>Courier: {trackingData.courier}</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactCourier}
        >
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTimeline = () => (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineTitle}>Tracking Timeline</Text>
      {trackingData.timeline.map((item, index) => (
        <View key={item.id} style={styles.timelineItem}>
          <View style={styles.timelineIcon}>
            <View style={[
              styles.timelineDot,
              item.completed ? styles.timelineDotCompleted : styles.timelineDotPending
            ]}>
              {item.completed && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
            {index < trackingData.timeline.length - 1 && (
              <View style={[
                styles.timelineLine,
                item.completed ? styles.timelineLineCompleted : styles.timelineLinePending
              ]} />
            )}
          </View>
          
          <View style={styles.timelineContent}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineStatus}>{item.status}</Text>
              <Text style={styles.timelineTime}>{item.time}</Text>
            </View>
            <Text style={styles.timelineDescription}>{item.description}</Text>
            <Text style={styles.timelineLocation}>{item.location}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderOrderDetails = () => (
    <View style={styles.orderDetailsContainer}>
      <Text style={styles.orderDetailsTitle}>Order Details</Text>
      
      {trackingData.orderDetails.products.map((product) => (
        <View key={product.id} style={styles.productItem}>
          <Image 
            source={getImageSource(product.image)}
            style={styles.productImage} 
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productOptions}>{product.options}</Text>
            <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
            <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
          </View>
        </View>
      ))}
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>{formatCurrency(trackingData.orderDetails.total)}</Text>
      </View>
    </View>
  );

  const renderShippingAddress = () => (
    <View style={styles.shippingAddressContainer}>
      <Text style={styles.shippingAddressTitle}>Shipping Address</Text>
      <View style={styles.addressInfo}>
        <Text style={styles.addressName}>{trackingData.orderDetails.shippingAddress.name}</Text>
        <Text style={styles.addressText}>{trackingData.orderDetails.shippingAddress.address}</Text>
        <Text style={styles.addressPhone}>{trackingData.orderDetails.shippingAddress.phone}</Text>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderOrderHeader()}
        {renderCurrentStatus()}
        {renderTimeline()}
        {renderOrderDetails()}
        {renderShippingAddress()}
      </ScrollView>
    </SafeAreaView>
  );
} 