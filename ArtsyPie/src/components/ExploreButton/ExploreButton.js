import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './ExploreButton.styles';

export default function ExploreButton({ title, onPress, icon }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.text}>{title}</Text>
        {icon && <Ionicons name={icon} size={25} color="#fff" style={styles.icon} />}
      </View>
    </TouchableOpacity>
  );
}