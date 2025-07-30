import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import styles from './OrderConfirmationScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { COLORS } from '../../theme/colors';

export default function OrderConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, total, subtotal, items, selectedAddress, selectedPayment, selectedDeliveryTime, selectedShippingMethod } = route.params;
  const artworksData = useSelector(state => state.artworks?.artworks || []);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const product = artworksData.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateShipping = () => {
    return selectedShippingMethod?.price || 30000;
  };

  const calculateDelivery = () => {
    return selectedDeliveryTime?.price || 50000;
  };

  const renderProductItem = (item) => {
    const product = artworksData.find(p => p.id === item.productId);
    if (!product) return null;

    return (
      <View key={item.productId} style={styles.productItem}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productArtist}>{product.artist}</Text>
          {item.size && item.frame && (
            <Text style={styles.productOptions}>
              {item.size} • {item.frame}
            </Text>
          )}
          <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
        </View>
        <Text style={styles.productPrice}>
          {formatCurrency((product.price || 0) * item.quantity)}
        </Text>
      </View>
    );
  };

  const renderOrderDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Details</Text>
      
      {/* Products */}
      <View style={styles.productsContainer}>
        {items.map(renderProductItem)}
      </View>

      {/* Delivery Address */}
      <View style={styles.detailRow}>
        <View style={styles.detailHeader}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.detailTitle}>Delivery Address</Text>
        </View>
        <Text style={styles.detailText}>{selectedAddress?.name}</Text>
        <Text style={styles.detailSubtext}>{selectedAddress?.address}</Text>
      </View>

      {/* Delivery Method */}
      <View style={styles.detailRow}>
        <View style={styles.detailHeader}>
          <Ionicons name="car" size={20} color={COLORS.primary} />
          <Text style={styles.detailTitle}>Delivery Method</Text>
        </View>
        <Text style={styles.detailText}>{selectedDeliveryTime?.name}</Text>
        <Text style={styles.detailSubtext}>{selectedDeliveryTime?.description}</Text>
      </View>

      {/* Payment Method */}
      <View style={styles.detailRow}>
        <View style={styles.detailHeader}>
          <Ionicons name="card" size={20} color={COLORS.primary} />
          <Text style={styles.detailTitle}>Payment Method</Text>
        </View>
        <Text style={styles.detailText}>{selectedPayment?.name}</Text>
        {selectedPayment?.id === 'card' && (
          <Text style={styles.detailSubtext}>**** **** **** 2512</Text>
        )}
      </View>
    </View>
  );

  const renderCostBreakdown = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cost Breakdown</Text>
      
      <View style={styles.costRow}>
        <Text style={styles.costLabel}>Sub-total (Products)</Text>
        <Text style={styles.costValue}>{formatCurrency(calculateSubtotal())}</Text>
      </View>
      
      <View style={styles.costRow}>
        <Text style={styles.costLabel}>VAT (10%)</Text>
        <Text style={styles.costValue}>{formatCurrency(calculateVAT())}</Text>
      </View>
      
      <View style={styles.costRow}>
        <Text style={styles.costLabel}>Shipping Fee</Text>
        <Text style={styles.costValue}>{formatCurrency(calculateShipping())}</Text>
      </View>
      
      <View style={styles.costRow}>
        <Text style={styles.costLabel}>Delivery Fee</Text>
        <Text style={styles.costValue}>{formatCurrency(calculateDelivery())}</Text>
      </View>
      
      <View style={[styles.costRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
        <Text style={styles.successTitle}>Order Placed Successfully!</Text>
        <Text style={styles.orderId}>Order ID: {orderId}</Text>
        <Text style={styles.totalAmount}>Total: {formatCurrency(total)}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderOrderDetails()}
        {renderCostBreakdown()}
        
        {/* Email Confirmation */}
        <View style={styles.section}>
          <View style={styles.emailInfo}>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.emailText}>
              A confirmation email has been sent to your email address
            </Text>
          </View>
        </View>

        {/* Estimated Delivery */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.deliveryInfo}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.deliveryText}>
              Estimated delivery: {selectedDeliveryTime?.time}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.historyButtonText}>View Order History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 