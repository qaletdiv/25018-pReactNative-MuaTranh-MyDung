import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from './LastSearches.styles';

export default function LastSearches({ searches = [], onClear, onRemove }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Last Search</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searches}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => onRemove(index)} style={styles.chipRemove}>
              <Text style={styles.chipRemoveText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
