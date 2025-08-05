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

  // Debug log
  // console.log('CartScreen - cartItems:', cartItems);
  // console.log('CartScreen - loading:', loading);
  // console.log('CartScreen - error:', error);

  // Load cart and artworks data when component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        await dispatch(fetchCartAsync()).unwrap();
      } catch (error) {
        Alert.alert('Error', error || 'Cannot load cart');
      }
    };

    loadCart();
    dispatch(fetchArtworks());
  }, [dispatch]);

  const handleUpdateQuantity = async (item, newQuantity) => {
    const itemId = item.productId || item.id;
    if (newQuantity <= 0) {
      try {
        await dispatch(removeFromCartAsync(itemId)).unwrap();
      } catch (error) {
        Alert.alert('Error', error || 'Cannot remove product');
      }
    } else {
      try {
        await dispatch(updateCartItemAsync({
          productId: itemId,
          quantity: newQuantity,
          selectedOptions: item.selectedOptions
        })).unwrap();
      } catch (error) {
        Alert.alert('Error', error || 'Cannot update quantity');
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCartAsync(itemId)).unwrap();
    } catch (error) {
              Alert.alert('Error', error || 'Cannot remove product');
    }
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
      <View key={`${item.id}_${index}`} style={styles.cartItem}>
        <Image source={imageSource} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.product?.name || 'Unknown Product'}</Text>
          <Text style={styles.productAuthor}>{item.product?.artist || 'Unknown Artist'}</Text>
          <Text style={styles.productOption}>
            {item.selectedOptions ?
              `${item.selectedOptions.size}, ${item.selectedOptions.frame}` :
              'Standard, No Frame'
            }
          </Text>
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
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.productId || item.id)}
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cartItems}>
          {cartItems.map((item, index) => renderCartItem(item, index))}
        </View>
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
          <Text style={styles.checkoutButtonText}>Go To Checkout</Text>
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