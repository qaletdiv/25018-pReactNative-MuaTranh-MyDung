import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './ArtistCard.styles';

export default function ArtistCard({ name, country, specialty, avatar, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.country}>{country}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
      </View>
    </TouchableOpacity>
  );
}
