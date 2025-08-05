// CardList.js
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import styles from './CategoryList.styles';

const CardList = ({ data }) => {
  const getImageSource = (src) => {
    if (!src) return null;
    
    // Nếu là require() object (local image)
    if (typeof src === 'number') {
      return src;
    }
    
    // Nếu là string URL
    if (typeof src === 'string') {
      return { uri: src };
    }
    
    // Fallback
    return src;
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
        <View style={{ width: '100%', height: 200, backgroundColor: '#333' }}>
          <Image 
            source={getImageSource(item.image)}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              // Silent error handling
            }}
            onLoad={() => {
              // Silent success handling
            }}
          />
        </View>

        {item.price && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${item.price}</Text>
          </View>
        )}

        {item.isNew && (
          <View style={styles.newTag}>
            <Text style={styles.newText}>New</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.authorContainer}>
            <Text style={styles.author}>{item.author}</Text>
            {item.avatar && (
              <Image
                source={getImageSource(item.avatar)}
                style={styles.avatar}
                resizeMode="cover"
                onError={(error) => {
                  // Silent error handling
                }}
                onLoad={() => {
                  // Silent success handling
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!data || data.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>No catalog data</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CardList;
