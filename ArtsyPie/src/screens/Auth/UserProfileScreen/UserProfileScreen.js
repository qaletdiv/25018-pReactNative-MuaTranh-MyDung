import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './UserProfileScreen.styles';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileScreen({ navigation }) {
  const handleLogout = () => {
    navigation.replace('Auth'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../../../../assets/Images/avatar.jpg')} 
          style={styles.avatar}
        />
        <Text style={styles.name}>Le Ngoc My Dung</Text>
        <Text style={styles.email}>dung@example.com</Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="person-outline" size={20} style={styles.icon} />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="settings-outline" size={20} style={styles.icon} />
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, styles.logout]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} style={[styles.icon, { color: 'red' }]} />
          <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
