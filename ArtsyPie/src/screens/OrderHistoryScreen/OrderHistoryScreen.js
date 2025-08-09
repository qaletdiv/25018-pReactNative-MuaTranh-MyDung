import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import styles from './OrderHistoryScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { fetchOrders } from '../../redux/slices/ordersSlice';

// Helper function to map image filenames to require paths
const getImageSource = (imageName) => {
  // Nếu là URL, trả về object với uri
  if (imageName && typeof imageName === 'string' && (imageName.startsWith('http') || imageName.startsWith('https'))) {
    return { uri: imageName };
  }
  
  // Nếu là local image name
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

const OrderHistoryScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const flatListRef = React.useRef(null);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchOrders(user.email));
    }
  }, [dispatch, user?.email]);

  // Debug: Log orders data
  console.log('OrderHistoryScreen - orders:', orders);
  console.log('OrderHistoryScreen - filteredOrders:', filteredOrders);
  
  // Nhận thông tin đơn hàng mới từ OrderConfirmationScreen
  const { newOrderId, highlightNewOrder } = route.params || {};
  
  // Tự động chuyển sang tab "Ongoing" nếu có đơn hàng mới
  React.useEffect(() => {
    if (highlightNewOrder && newOrderId) {
      setActiveTab('ongoing');
      
      // Scroll đến đơn hàng mới sau khi component mount
      setTimeout(() => {
        const newOrderIndex = filteredOrders.findIndex(order => order.id === newOrderId);
        if (newOrderIndex !== -1) {
          flatListRef.current?.scrollToIndex({
            index: newOrderIndex,
            animated: true,
            viewPosition: 0
          });
        }
      }, 500);
    }
  }, [highlightNewOrder, newOrderId]);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
      case 'Pending Confirmation':
        return 'Pending';
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

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ongoing') {
      return ['pending', 'processing', 'shipping', 'Pending Confirmation'].includes(order.status);
    } else {
      return ['completed', 'cancelled'].includes(order.status);
    }
  });

  const renderOrderItem = ({ item }) => {
    // Debug: Log order item data
    console.log('OrderHistoryScreen - rendering order:', {
      id: item.id,
      total: item.total,
      totalType: typeof item.total,
      status: item.status,
      products: item.products
    });
    
    // Highlight đơn hàng mới nếu có
    const isNewOrder = newOrderId && item.id === newOrderId;
    
    return (
      <TouchableOpacity
        style={[
          styles.orderItem,
          isNewOrder && { borderColor: '#FFA500', borderWidth: 2 }
        ]}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.id || item.orderNumber}</Text>
            <Text style={styles.orderDate}>{item.orderDate || item.date}</Text>
            {isNewOrder && (
              <Text style={{ color: '#FFA500', fontSize: 12, fontWeight: 'bold' }}>
                NEW ORDER
              </Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        {(item.products || item.items || []).map((product, index) => {
          // Xử lý cả hai format: products (cũ) và items (mới)
          const productData = product.product || product; // items có product.product, products có product trực tiếp
          const productName = productData.name || productData.title;
          const productImage = productData.image;
          const productPrice = productData.price || 0;
          const productQuantity = product.quantity || 1;
          const productOptions = product.selectedOptions ? 
            `${product.selectedOptions.size}, ${product.selectedOptions.frame}` : 
            (product.options || product.size || 'Standard, No Frame');
          
          return (
            <View key={`${item.id}_${productData.id || product.id}_${index}`} style={styles.productItem}>
              <Image 
                source={getImageSource(productImage)}
                style={styles.productImage} 
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{productName}</Text>
                <Text style={styles.productSize}>{productOptions}</Text>
                <Text style={styles.productPrice}>{formatCurrency(productPrice * productQuantity)}</Text>
              </View>
              <View style={styles.productActions}>
                {item.status === 'completed' && !product.hasReview && (
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => navigation.navigate('LeaveReview', { product: productData, order: item })}
                  >
                    <Text style={styles.reviewButtonText}>Leave Review</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'completed' && product.hasReview && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating}/5</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(
              item.total || 
              item.totalAmount || 
              (item.products?.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0) || 0) ||
              (item.items?.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0) || 0)
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={styles.headerTitle.color} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications" size={24} color={styles.headerTitle.color} />
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#AA7F60" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube" size={48} color="#888888" />
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default OrderHistoryScreen; 