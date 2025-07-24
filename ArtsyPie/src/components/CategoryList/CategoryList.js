// CardList.js
import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './CategoryList.styles';

const CardList = ({ data }) => {
  const renderItem = ({ item }) => {
    const getImageSource = (src) => {
      if (!src) return null;
      return typeof src === 'string' ? { uri: src } : src;
    };

    return (
      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
        {item.image && (
          <Image source={getImageSource(item.image)} style={styles.image} />
        )}

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
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
