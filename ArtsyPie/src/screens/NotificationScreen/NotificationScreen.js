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
import { useNavigation } from '@react-navigation/native';
import styles from './NotificationScreen.styles';
import { COLORS } from '../../theme/colors';

export default function NotificationScreen() {
  const navigation = useNavigation();
  
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order ORD123456789 has been confirmed and is being processed.',
      time: '2 hours ago',
      isRead: false,
      orderId: 'ORD123456789',
    },
    {
      id: '2',
      type: 'shipping',
      title: 'Order Shipped',
      message: 'Your order ORD123456789 has been shipped and is on its way to you.',
      time: '1 day ago',
      isRead: false,
      orderId: 'ORD123456789',
    },
    {
      id: '3',
      type: 'promo',
      title: 'Special Offer',
      message: 'Get 20% off on all landscape paintings this weekend!',
      time: '2 days ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'delivery',
      title: 'Order Delivered',
      message: 'Your order ORD123456789 has been successfully delivered.',
      time: '3 days ago',
      isRead: true,
      orderId: 'ORD123456789',
    },
    {
      id: '5',
      type: 'system',
      title: 'Welcome to ArtsyPie',
      message: 'Thank you for joining our community of art lovers!',
      time: '1 week ago',
      isRead: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return 'checkmark-circle';
      case 'shipping':
        return 'car';
      case 'delivery':
        return 'home';
      case 'promo':
        return 'gift';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return '#28a745';
      case 'shipping':
        return '#007bff';
      case 'delivery':
        return '#17a2b8';
      case 'promo':
        return '#ffc107';
      case 'system':
        return '#6c757d';
      default:
        return COLORS.primary;
    }
  };

  const handleNotificationPress = (notification) => {

    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notification.id 
          ? { ...notif, isRead: true }
          : notif
      )
    );

  
    if (notification.orderId) {
      navigation.navigate('OrderDetail', { 
        order: { 
          id: notification.orderId,
          status: notification.type === 'delivery' ? 'completed' : 'processing'
        } 
      });
    } else if (notification.type === 'promo') {
      navigation.navigate('Home');
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => setNotifications([])
        },
      ]
    );
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notif => !notif.isRead);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const renderNotificationItem = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationIcon}>
        <Ionicons 
          name={getNotificationIcon(notification.type)} 
          size={24} 
          color={getNotificationColor(notification.type)} 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
      
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        {activeTab === 'all' 
          ? "You don't have any notifications yet."
          : "You don't have any unread notifications."
        }
      </Text>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
            >
              <Text style={styles.markAllButtonText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAll}
            >
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.notificationsList}>
            {filteredNotifications.map(renderNotificationItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 