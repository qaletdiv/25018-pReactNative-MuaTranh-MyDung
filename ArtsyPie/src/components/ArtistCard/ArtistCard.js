import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './ArtistCard.styles';

export default function ArtistCard({ name, country, avatar }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.country}>{country}</Text>
      </View>
    </View>
  );
}
