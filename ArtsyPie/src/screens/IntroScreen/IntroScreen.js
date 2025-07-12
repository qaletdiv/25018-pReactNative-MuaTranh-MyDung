import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './IntroScreen.styles';
import ExploreButton from '../../components/ExploreButton/ExploreButton';

export default function IntroScreen({ navigation }) {
  const handleExplore = async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    navigation.replace('AppNavigator');
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    navigation.replace('AppNavigator', { screen: 'LoginScreen' });
  };

  return (
    <ImageBackground
      source={require('../../../assets/Images/intro/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>A gallery not bound{'\n'}by walls</Text>
        <Text style={styles.subtitle}>
          Scan, Curate & Share, Elevate{'\n'} your artistic journey.
        </Text>

        <ExploreButton
          title="Start Exploring"
          icon="arrow-forward-outline"
          onPress={handleExplore}
        />

        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
