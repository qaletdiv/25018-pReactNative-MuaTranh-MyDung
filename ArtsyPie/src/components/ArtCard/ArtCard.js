import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import styles from './ArtCard.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectIsFavorite, toggleFavorite } from '../../redux/slices/favoritesSlice';

export default function ArtCard({ item, onPress, compact = false, showFavorite = true }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => selectIsFavorite(state, item.id));
  const token = useSelector(state => state.auth.token);

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
    if (!token) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigation.navigate('LoginScreen');
      return;
    }
    dispatch(toggleFavorite(item));
  };

  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]} 
      onPress={handlePress}
    >
      <Image 
        source={{ uri: item.image }} 
        style={[styles.image, compact && styles.compactImage]} 
      />
      
      {/* nut yeu thich */}
      {showFavorite && (
        <TouchableOpacity 
          style={[styles.favoriteButton, compact && styles.compactFavoriteButton]}
          onPress={handleFavoritePress}
        >
          <Icon 
            name={isFavorite ? "heart" : "heart"} 
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