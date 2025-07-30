import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import styles from './FavoritesScreen.styles';

import ArtCard from '../../components/ArtCard/ArtCard';
import { selectFavorites, removeFromFavorites } from '../../redux/slices/favoritesSlice';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

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
      <Icon name="heart" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
      <Text style={styles.emptySubtitle}>
        Khám phá và thêm sản phẩm vào danh sách yêu thích của bạn
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('MainTabs')}
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
        <Icon name="x" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        <Text style={styles.favoriteCount}>{favorites.length} sản phẩm</Text>
      </View>

      {favorites.length === 0 ? (
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