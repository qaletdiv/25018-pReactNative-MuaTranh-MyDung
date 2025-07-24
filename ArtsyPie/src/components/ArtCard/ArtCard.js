import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './ArtCard.styles';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ArtCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.artist}>{item.artist}</Text>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        <View style={styles.tagContainer}>
          <View style={[styles.tag, { backgroundColor: item.tagColor }]}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}