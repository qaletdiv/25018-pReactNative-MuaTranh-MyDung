import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './OrderDetailScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { COLORS } from '../../theme/colors';

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

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
    case 'Pending Confirmation':
      return '#FFA500';
    case 'processing':
      return '#007AFF';
    case 'shipping':
      return '#FF6B35';
    case 'completed':
      return '#4C956C';
    case 'cancelled':
      return '#D9534F';
    default:
      return '#888888';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
    case 'Pending Confirmation':
      return 'Pending Confirmation';
    case 'processing':
      return 'Processing';
    case 'shipping':
      return 'Shipping';
    case 'completed':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
    case 'Pending Confirmation':
      return 'time-outline';
    case 'processing':
      return 'construct-outline';
    case 'shipping':
      return 'car-outline';
    case 'completed':
      return 'checkmark-circle-outline';
    case 'cancelled':
      return 'close-circle-outline';
    default:
      return 'help-circle-outline';
  }
};

export default function OrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params;

  const renderOrderHeader = () => (
    <View style={styles.orderHeader}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>{order.id || order.orderNumber}</Text>
        <Text style={styles.orderDate}>{order.orderDate || order.date}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
        <Ionicons name={getStatusIcon(order.status)} size={16} color="#fff" />
        <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
      </View>
    </View>
  );

  const renderOrderProgress = () => {
    const steps = [
      { key: 'ordered', label: 'Ordered', icon: 'checkmark-circle' },
      { key: 'confirmed', label: 'Confirmed', icon: 'checkmark-circle' },
      { key: 'processing', label: 'Processing', icon: 'construct' },
      { key: 'shipping', label: 'Shipping', icon: 'car' },
      { key: 'delivered', label: 'Delivered', icon: 'home' },
    ];

    const getCurrentStep = () => {
      switch (order.status) {
        case 'pending':
        case 'Pending Confirmation':
          return 1;
        case 'processing':
          return 2;
        case 'shipping':
          return 3;
        case 'completed':
          return 4;
        default:
          return 0;
      }
    };

    const currentStep = getCurrentStep();

    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Order Progress</Text>
        <View style={styles.progressSteps}>
          {steps.map((step, index) => (
            <View key={step.key} style={styles.stepContainer}>
              <View style={[
                styles.stepIcon,
                index <= currentStep ? styles.stepActive : styles.stepInactive
              ]}>
                <Ionicons 
                  name={step.icon} 
                  size={20} 
                  color={index <= currentStep ? '#fff' : '#ccc'} 
                />
              </View>
              <Text style={[
                styles.stepLabel,
                index <= currentStep ? styles.stepLabelActive : styles.stepLabelInactive
              ]}>
                {step.label}
              </Text>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepLine,
                  index < currentStep ? styles.stepLineActive : styles.stepLineInactive
                ]} />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderProducts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Products</Text>
      {order.products && order.products.map((product, index) => (
        <View key={`${order.id}_${product.id}_${index}`} style={styles.productItem}>
          <Image 
            source={getImageSource(product.image)}
            style={styles.productImage} 
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productOptions}>{product.options || product.size}</Text>
            <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
            <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
          </View>
          {order.status === 'completed' && !product.hasReview && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate('LeaveReview', { product, order })}
            >
              <Text style={styles.reviewButtonText}>Leave Review</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderShippingInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Shipping Information</Text>
      <View style={styles.infoRow}>
        <Ionicons name="location" size={20} color={COLORS.primary} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Delivery Address</Text>
          <Text style={styles.infoValue}>{order.address?.name}</Text>
          <Text style={styles.infoSubtext}>{order.address?.address}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="car" size={20} color={COLORS.primary} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Delivery Method</Text>
          <Text style={styles.infoValue}>{order.deliveryTime?.name}</Text>
          <Text style={styles.infoSubtext}>{order.deliveryTime?.description}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="card" size={20} color={COLORS.primary} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Payment Method</Text>
          <Text style={styles.infoValue}>{order.paymentMethod?.name}</Text>
        </View>
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatCurrency(order.total)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.summaryValue}>{formatCurrency(order.shippingMethod?.price || 0)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery</Text>
        <Text style={styles.summaryValue}>{formatCurrency(order.deliveryTime?.price || 0)}</Text>
      </View>
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => {
          // Navigate to contact support
          navigation.navigate('ContactSupport', { orderId: order.id });
        }}
      >
        <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>
      
             {(order.status === 'shipping' || order.status === 'processing') && (
         <TouchableOpacity 
           style={styles.trackButton}
           onPress={() => {
             // Navigate to tracking screen
             navigation.navigate('OrderTracking', { orderId: order.id });
           }}
         >
           <Ionicons name="location-outline" size={20} color="#fff" />
           <Text style={styles.trackButtonText}>Track Order</Text>
         </TouchableOpacity>
       )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderOrderHeader()}
        {renderOrderProgress()}
        {renderProducts()}
        {renderShippingInfo()}
        {renderOrderSummary()}
      </ScrollView>

      {renderActions()}
    </SafeAreaView>
  );
} 