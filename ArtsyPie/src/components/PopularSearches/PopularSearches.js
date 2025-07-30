import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ArtCard from '../ArtCard/ArtCard';
import styles from './PopularSearches.styles';

export default function PopularSearches({ data = [], onArtCardPress }) {
  const renderArtCard = ({ item }) => (
    <ArtCard item={item} onPress={onArtCardPress} compact={true} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Searches</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderArtCard}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
