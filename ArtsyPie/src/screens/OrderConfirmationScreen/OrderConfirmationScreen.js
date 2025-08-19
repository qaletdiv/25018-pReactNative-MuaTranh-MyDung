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
import { useSelector, useDispatch } from 'react-redux';
import styles from './OrderConfirmationScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatTime } from '../../utils/formatDate';
import { COLORS } from '../../theme/colors';
import { clearCart } from '../../redux/slices/cartSlice';
import { addNewOrder } from '../../redux/slices/ordersSlice';

export default function OrderConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { orderId, total: totalFromParams, subtotal, items, selectedAddress, selectedPayment, selectedDeliveryTime, selectedShippingMethod } = route.params;
  
  // Đảm bảo total luôn có giá trị hợp lệ
  const total = typeof totalFromParams === 'number' && totalFromParams > 0 ? totalFromParams : 0;
  
  // Tính total fallback nếu không có từ params
  const calculateTotalFallback = () => {
    const subtotal = items?.reduce((sum, item) => {
      const product = artworksData.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0) || 0;
    const vat = subtotal * 0.1;
    const shipping = selectedShippingMethod?.price || 30000;
    const delivery = selectedDeliveryTime?.price || 50000;
    return subtotal + vat + shipping + delivery;
  };
  
  const finalTotal = total > 0 ? total : calculateTotalFallback();
  
  // Debug: Log dữ liệu nhận được
  // console.log('OrderConfirmation - Route params:', {
  //   orderId,
  //   totalFromParams,
  //   total,
  //   finalTotal,
  //   totalType: typeof total,
  //   subtotal,
  //   itemsCount: items?.length,
  //   selectedAddress,
  //   selectedPayment,
  //   selectedDeliveryTime,
  //   selectedShippingMethod
  // });

  // Thêm order vào Redux store nếu chưa có
  React.useEffect(() => {
    if (orderId && finalTotal > 0) {
      // Tạo ngày tháng đơn hàng TRƯỚC KHI tạo newOrder
      const now = new Date();
      const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // Format: YYYY-MM-DD
      const orderTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const newOrder = {
        id: orderId,
        orderNumber: orderId,
        date: orderDate, // Sử dụng orderDate đã tạo
        orderDate: orderDate, // Thêm cả orderDate để đảm bảo tương thích
        orderTime: orderTime, // Sử dụng orderTime đã tạo
        createdAt: new Date().toISOString(), // Thêm timestamp đầy đủ
        status: 'pending',
        total: finalTotal,
        products: items?.map(item => ({
          id: item.productId || item.id,
          name: item.product?.name || 'Unknown Product',
          image: item.product?.image,
          price: item.product?.price || 0,
          options: item.selectedOptions ? 
            `${item.selectedOptions.size}, ${item.selectedOptions.frame}` : 
            'Standard, No Frame',
          quantity: item.quantity
        })) || [],
        address: selectedAddress,
        paymentMethod: selectedPayment,
        deliveryTime: selectedDeliveryTime,
        shippingMethod: selectedShippingMethod,
      };
      
      dispatch(addNewOrder(newOrder));
    }
  }, [orderId, finalTotal, items, selectedAddress, selectedPayment, selectedDeliveryTime, selectedShippingMethod]);
  
  // Tạo ngày tháng đơn hàng cho hiển thị UI
  const now = new Date();
  const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // Format: YYYY-MM-DD
  const orderTime = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
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

  // Clear cart sau khi thanh toán thành công
  React.useEffect(() => {
    dispatch(clearCart());
  }, []);

  const renderProductItem = (item) => {
    const productName = item.product?.name || item.product?.title || 'Unknown Product';
    const productArtist = item.product?.artist || 'Unknown Artist';
    const productImage = item.product?.image;
    const productPrice = item.product?.price || 0;

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
      
      if (imageName && imageName.startsWith('http')) {
        return { uri: imageName };
      }
      
      return imageMap[imageName] || require('../../../assets/Images/Product/impressionlsm.jpg');
    };

    return (
      <View key={item.productId} style={styles.productItem}>
        <Image source={getImageSource(productImage)} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{productName}</Text>
          <Text style={styles.productArtist}>{productArtist}</Text>
          <Text style={styles.productOption}>
            {item.selectedOptions ? 
              `${item.selectedOptions.size}, ${item.selectedOptions.frame}` : 
              'Standard, No Frame'
            }
          </Text>
          <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>
            {formatCurrency((productPrice * 1.05) * item.quantity)}
          </Text>
          <Text style={styles.discountedPrice}>
            {formatCurrency(productPrice * item.quantity)}
          </Text>
        </View>
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
        <Text style={styles.detailText}>{selectedAddress?.fullName || selectedAddress?.name || 'Unknown'}</Text>
        <Text style={styles.detailSubtext}>{selectedAddress?.address || 'No address provided'}</Text>
        {selectedAddress?.phone && (
          <Text style={styles.detailSubtext}>Phone: {selectedAddress.phone}</Text>
        )}
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
        <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
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
        
        {/* Thêm thông tin ngày giờ đặt hàng */}
        <View style={styles.orderDateTimeContainer}>
          <Text style={styles.orderDateText}>
            📅 {formatDate(orderDate)}
          </Text>
          <Text style={styles.orderTimeText}>
            🕐 {formatTime(orderDate + 'T' + orderTime)}
          </Text>
        </View>
        
        <Text style={styles.totalAmount}>Total: {formatCurrency(finalTotal)}</Text>
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
          onPress={() => navigation.navigate('OrderHistory', { 
            newOrderId: orderId,
            highlightNewOrder: true 
          })}
        >
          <Text style={styles.historyButtonText}>View Order History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 