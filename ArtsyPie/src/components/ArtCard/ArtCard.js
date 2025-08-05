import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import styles from './ArtCard.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectIsFavorite, toggleFavorite, removeFromFavorites } from '../../redux/slices/favoritesSlice';

export default function ArtCard({ item, onPress, compact = false, showFavorite = true }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => selectIsFavorite(state, item.id));
  const { isAuthenticated } = useSelector(state => state.auth);

  // Không cần check API, chỉ sử dụng local state
  // useEffect(() => {
  //   if (isAuthenticated && item.id) {
  //     dispatch(checkFavoriteAsync(item.id));
  //   }
  // }, [dispatch, isAuthenticated, item.id]);

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      // mac dinh navigation productdetail
      navigation.navigate('ProductDetail', { item });
    }
  };

  const handleFavoritePress = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigation.navigate('LoginScreen');
      return;
    }
    
    // Sử dụng local state trực tiếp
    if (isFavorite) {
      dispatch(removeFromFavorites(item.id));
    } else {
      dispatch(toggleFavorite(item));
    }
  };

  // Helper function để xử lý image source
  const getImageSource = () => {
    if (!item.image) {
      return null; // Không hiển thị gì nếu không có image
    }
    
    // Nếu là string URL (bắt đầu bằng http)
    if (typeof item.image === 'string' && item.image.startsWith('http')) {
      return { uri: item.image };
    }
    
    // Nếu là tên file từ assets (ví dụ: 'impressionlsm.jpg')
    if (typeof item.image === 'string') {
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
      
      return imageMap[item.image] || require('../../../assets/Images/Product/impressionlsm.jpg');
    }
    
    // Nếu là require() object hoặc local image
    return item.image;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]} 
      onPress={handlePress}
    >
      <Image 
        source={getImageSource()} 
        style={[styles.image, compact && styles.compactImage]} 
        resizeMode="cover"
      />
      
      {/* nut yeu thich */}
      {showFavorite && (
        <TouchableOpacity 
          style={[styles.favoriteButton, compact && styles.compactFavoriteButton]}
          onPress={handleFavoritePress}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={compact ? 16 : 20} 
            color={isFavorite ? "#FF6B6B" : "#fff"} 
            style={isFavorite ? styles.filledHeart : styles.outlineHeart}
          />
        </TouchableOpacity>
      )}

      <View style={[styles.info, compact && styles.compactInfo]}>
        <Text 
          style={[styles.title, compact && styles.compactTitle]} 
          numberOfLines={compact ? 1 : 2}
        >
          {item.title}
        </Text>
        <Text style={[styles.artist, compact && styles.compactArtist]}>
          {item.artist}
        </Text>
        <Text style={[styles.price, compact && styles.compactPrice]}>
          {formatCurrency(item.price)}
        </Text>
        <View style={styles.tagContainer}>
          <View style={[styles.tag, { backgroundColor: item.tagColor }, compact && styles.compactTag]}>
            <Text style={[styles.tagText, compact && styles.compactTagText]}>
              {item.tag}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}