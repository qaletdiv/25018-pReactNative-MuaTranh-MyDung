import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../redux/slices/authSlice';
import styles from './AccountScreen.styles';

const AccountScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  


  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            // Quay về màn hình Home sau khi logout
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: 'cube',
      onPress: () => navigation.navigate('OrderHistory'),
    },
    {
      id: 'favorites',
      title: 'Favorites',
      icon: 'heart',
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      id: 'address',
      title: 'Address Book',
      icon: 'location',
      onPress: () => navigation.navigate('AddressBook'),
    },
    {
      id: 'editProfile',
      title: 'Edit Profile',
      icon: 'person',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'changePassword',
      title: 'Change Password',
      icon: 'lock-closed',
      onPress: () => navigation.navigate('ChangePassword'),
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: 'card',
      onPress: () => navigation.navigate('PaymentMethod'),
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
                    <Ionicons name={item.icon} size={20} color={styles.menuItemText.color} />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
                <Ionicons name="chevron-forward" size={20} color={styles.menuItemText.color} />
    </TouchableOpacity>
  );

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
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
          <Text style={styles.headerTitle}>Account</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notification')}
          >
            <Ionicons name="notifications" size={24} color={styles.headerTitle.color} />
          </TouchableOpacity>
        </View>

        <View style={styles.loginPromptContainer}>
          <Ionicons name="person" size={80} color="#AA7F60" />
          <Text style={styles.loginPromptTitle}>Welcome to ArtsyPie</Text>
          <Text style={styles.loginPromptText}>
            Please login to access your account and manage your orders, favorites, and profile.
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications" size={24} color={styles.headerTitle.color} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={styles.avatarText.color} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={styles.logoutButtonText.color} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AccountScreen; 