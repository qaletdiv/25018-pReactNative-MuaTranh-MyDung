import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import UserProfileScreen from '../screens/Auth/UserProfileScreen/UserProfileScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen/ProductDetailScreen';
import ProductListScreen from '../screens/ProductListScreen/ProductListScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import CartScreen from '../screens/CartScreen/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen/OrderConfirmationScreen';
import AddressSelectionScreen from '../screens/AddressSelectionScreen/AddressSelectionScreen';
import NewAddressScreen from '../screens/NewAddressScreen/NewAddressScreen';
import DeliveryTimeSelectionScreen from '../screens/DeliveryTimeSelectionScreen/DeliveryTimeSelectionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
      <Stack.Screen name="NewAddressScreen" component={NewAddressScreen} />
      <Stack.Screen name="DeliveryTimeSelection" component={DeliveryTimeSelectionScreen} />
    </Stack.Navigator>
  );
}
