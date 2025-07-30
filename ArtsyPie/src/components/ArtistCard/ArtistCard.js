import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './ArtistCard.styles';

export default function ArtistCard({ name, country, avatar, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.country}>{country}</Text>
      </View>
    </TouchableOpacity>
  );
}
