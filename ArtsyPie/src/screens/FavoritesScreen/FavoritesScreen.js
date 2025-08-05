import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import styles from './FavoritesScreen.styles';

import ArtCard from '../../components/ArtCard/ArtCard';
import { selectFavorites, selectFavoritesLoading, selectFavoritesError, removeFromFavorites } from '../../redux/slices/favoritesSlice';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites) || [];
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);

  // Không  gọi API, chỉ sử dụng local state
  // useEffect(() => {
  //   dispatch(fetchFavoritesAsync());
  // }, [dispatch]);

  const handleRemoveFavorite = (item) => {
    Alert.alert(
      'Xóa khỏi yêu thích',
      `Bạn có chắc muốn xóa "${item.title}" khỏi danh sách yêu thích?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            dispatch(removeFromFavorites(item.id));
            Alert.alert('Thành công', 'Đã xóa khỏi danh sách yêu thích');
          }
        }
      ]
    );
  };

  const handleArtCardPress = (item) => {
    navigation.navigate('ProductDetail', { item });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
              <Ionicons name="heart" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
      <Text style={styles.emptySubtitle}>
        Khám phá và thêm sản phẩm vào danh sách yêu thích của bạn
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <ArtCard 
        item={item} 
        onPress={() => handleArtCardPress(item)}
        compact
        showFavorite={false}
      />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item)}
      >
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#AA7F60" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={80} color="#ff6b6b" />
          <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(fetchFavoritesAsync())}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        <Text style={styles.favoriteCount}>{favorites.length} sản phẩm</Text>
      </View>

      {!favorites || favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.favoritesList}
        />
      )}
    </SafeAreaView>
  );
} 