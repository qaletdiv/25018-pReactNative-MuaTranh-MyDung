import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from './LastSearches.styles';

export default function LastSearches({ searches = [], onClear, onRemove }) {
  // Giữ 10 kết quả gần nhất
  const recentSearches = searches.slice(0, 10);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Last Search</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentSearches}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText} numberOfLines={1}>{item}</Text>
            <TouchableOpacity onPress={() => onRemove(item)} style={styles.chipRemove}>
              <Text style={styles.chipRemoveText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
