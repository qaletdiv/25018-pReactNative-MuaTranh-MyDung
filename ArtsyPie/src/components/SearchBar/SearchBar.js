// components/SearchBar/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './SearchBar.styles';

export default function SearchBar({ 
  compact = false, 
  showBack = false, 
  onBackPress,
  placeholder = "Search for paintings...",
  searchText,
  onChangeText,
  editable = false // kiểm soát có cho nhập hay không
}) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (!editable) {
      navigation.navigate('SearchScreen');
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={editable ? 1 : 0.8}
      style={[styles.wrapper, compact && styles.compactWrapper]}
    >
      {showBack && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={styles.iconLeft.color} />
        </TouchableOpacity>
      )}

      <View style={[styles.container, compact && styles.compactContainer]}>
        <Ionicons name="search" size={20} style={styles.iconLeft} />
        <TextInput
          style={[styles.input, compact && styles.compactInput]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={onChangeText}
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
        />
        {/* {!compact && (
          <MaterialCommunityIcons
            name="tune"
            size={20}
            color={styles.iconRight.color}
            style={styles.iconRight}
          />
        )} */}
      </View>

      {!compact && (
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
