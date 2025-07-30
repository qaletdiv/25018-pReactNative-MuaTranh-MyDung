import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CartScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { removeFromCart, updateCartItem } from '../../redux/slices/cartSlice';
import artworksData from '../../data/artworksData';

export default function CartScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);

  const handleRemoveFromCart = (itemId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            dispatch(removeFromCart(itemId));
          }
        }
      ]
    );
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    dispatch(updateCartItem({ productId: itemId, quantity: newQuantity }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = artworksData.find(art => art.id === item.productId);
      return total + ((product?.price || 0) * item.quantity);
    }, 0);
  };

  const calculateShipping = () => {
    return 50000; // Phí vận chuyển cố định
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.');
      return;
    }
    
    const subtotal = calculateSubtotal();
    const vat = subtotal * 0.1; // VAT 10%
    const totalWithoutShipping = subtotal + vat; // Total không bao gồm phí ship
    
    // Truyền đầy đủ thông tin đến CheckoutScreen
    navigation.navigate('Checkout', {
      cartItems: JSON.parse(JSON.stringify(cartItems)), 
      subtotal: subtotal,
      vat: vat,
      totalWithoutShipping: totalWithoutShipping
    });
  };

  const renderCartItem = ({ item }) => {
    // Tìm thông tin sản phẩm từ artworksData
    const product = artworksData.find(art => art.id === item.productId);
    
    if (!product) {
      return null;
    }
    
    return (
      <View style={styles.cartItem}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.itemImage}
          resizeMode="cover"
        />
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>{product.title}</Text>
          <Text style={styles.itemArtist}>{product.artist}</Text>
          {item.size && item.frame && (
            <Text style={styles.itemOptions}>
              {item.size} • {item.frame}
            </Text>
          )}
          <Text style={styles.itemPrice}>{formatCurrency(product.price)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveFromCart(item.productId)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyCartTitle}>Empty Cart</Text>
      <Text style={styles.emptyCartText}>You don't have any items in your cart</Text>
      <TouchableOpacity 
        style={styles.continueShoppingButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.orderSummary}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Sub-total:</Text>
        <Text style={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>VAT (10%):</Text>
        <Text style={styles.summaryValue}>{formatCurrency(calculateSubtotal() * 0.1)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping fee:</Text>
        <Text style={styles.summaryValue}>{formatCurrency(calculateShipping())}</Text>
      </View>
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>{formatCurrency(calculateTotal() + calculateSubtotal() * 0.1)}</Text>
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
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.placeholder} />
      </View>

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartList}
          />
          
          {renderOrderSummary()}
          
          <View style={styles.checkoutContainer}>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>
                Go to Checkout ({cartItems.length} items)
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
} 