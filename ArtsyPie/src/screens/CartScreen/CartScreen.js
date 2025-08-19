import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import styles from './CartScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  fetchCartAsync,
  removeFromCartAsync,
  removeCartItemByIndexAsync,
  updateCartItemAsync,
  clearCartAsync
} from '../../redux/slices/cartSlice';
import { fetchArtworks } from '../../redux/slices/artworksSlice';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get cart data from Redux state (from API)
  const { cartItems, loading, error } = useSelector(state => state.cart);
  const artworks = useSelector(state => state.artworks.artworks);



  // Load cart and artworks data when component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        await dispatch(fetchCartAsync()).unwrap();
      } catch (error) {
        Alert.alert(
          'Lỗi tải giỏ hàng', 
          error || 'Không thể tải giỏ hàng. Vui lòng thử lại.',
          [
            { text: 'Hủy', style: 'cancel' },
            { 
              text: 'Thử lại', 
              onPress: () => loadCart()
            }
          ]
        );
      }
    };

    loadCart();
    dispatch(fetchArtworks());
  }, [dispatch]);

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      // Nếu quantity <= 0, xóa sản phẩm
      try {
        await dispatch(removeFromCartAsync({
          productId: item.productId,
          selectedOptions: item.selectedOptions
        })).unwrap();
      } catch (error) {
        Alert.alert('Error', error || 'Cannot remove product');
      }
    } else {
      try {
        await dispatch(updateCartItemAsync({
          productId: item.productId,
          quantity: newQuantity,
          selectedOptions: item.selectedOptions
        })).unwrap();
      } catch (error) {
        Alert.alert('Error', error || 'Cannot update quantity');
      }
    }
  };

  // Cách 1: Xóa theo selectedOptions (chính xác)
  const handleRemoveItem = (productId, selectedOptions) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeFromCartAsync({
                productId,
                selectedOptions
              })).unwrap();
            } catch (error) {
              Alert.alert('Error', error || 'Cannot remove product');
            }
          }
        }
      ]
    );
  };

  // Cách 2: Xóa theo index (dễ dàng hơn)
  const handleRemoveItemByIndex = (index) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeCartItemByIndexAsync(index)).unwrap();
            } catch (error) {
              Alert.alert('Error', error || 'Cannot remove product');
            }
          }
        }
      ]
    );
  };

  const handleClearCart = async () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(clearCartAsync()).unwrap();
            } catch (error) {
              Alert.alert('Lỗi', error || 'Can not delete cart');
            }
          }
        }
      ]
    );
  };

  const renderCartItem = (item, index) => {
    const imageSource = item.product?.image 
      ? (typeof item.product.image === 'string' && item.product.image.startsWith('http') 
          ? { uri: item.product.image } 
          : item.product.image)
      : require('../../../assets/Images/Product/plus1.jpg');

    return (
      <View key={`${item.productId}-${JSON.stringify(item.selectedOptions)}-${index}`} style={styles.cartItem}>
        <Image source={imageSource} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.product?.name || 'Unknown Product'}</Text>
          <Text style={styles.productAuthor}>{item.product?.artist || 'Unknown Artist'}</Text>
          
          {/* Hiển thị selectedOptions */}
          <View style={styles.optionsContainer}>
            <Text style={styles.productOption}>
              Size: {item.selectedOptions?.size || 'Standard'}
            </Text>
            <Text style={styles.productOption}>
              Frame: {item.selectedOptions?.frame || 'No Frame'}
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>
              {formatCurrency(((item.product?.price || 0) * 1.05) * item.quantity)}
            </Text>
            <Text style={styles.discountedPrice}>
              {formatCurrency((item.product?.price || 0) * item.quantity)}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color="#2B2B2B" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color="#2B2B2B" />
              </TouchableOpacity>
            </View>
            
            {/* Delete button - Sử dụng index (dễ dàng hơn) */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItemByIndex(index)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color="#AA7F60" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2B2B2B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#E8E2DB" />
          <Text style={styles.emptyTitle}>Empty Cart</Text>
          <Text style={styles.emptyText}>
            You don't have any items in your cart
          </Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2B2B2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({cartItems.length})</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cartItems}>
          {cartItems.map((item, index) => renderCartItem(item, index))}
        </View>
        {/* Add bottom padding to prevent bottom tab overlap */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0))}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>Go to Checkout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        >
          <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen; 