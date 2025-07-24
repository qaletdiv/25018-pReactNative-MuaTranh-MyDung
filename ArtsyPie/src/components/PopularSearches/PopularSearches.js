import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import styles from './PopularSearches.styles';

export default function PopularSearches({ data = [] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Search</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.searchCount}>{item.searchCount} Search today</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: item.tagColor }]}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
