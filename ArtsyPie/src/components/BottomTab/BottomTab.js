import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './BottomTab.styles';

export default function BottomTab() {
  const navigation = useNavigation();

  const handleTabPress = (screenName) => {
    if (screenName === 'Search') {
      navigation.navigate('Search');
    } else if (screenName === 'Home') {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleTabPress('Home')}
      >
        <Text style={styles.tabIcon}>🏠</Text>
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleTabPress('Search')}
      >
        <Text style={styles.tabIcon}>🔍</Text>
        <Text style={styles.tabLabel}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Text style={styles.tabIcon}>❤️</Text>
        <Text style={styles.tabLabel}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Text style={styles.tabIcon}>👤</Text>
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
