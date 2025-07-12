import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
// Navigation
import MainNavigator from './src/navigation/MainNavigator';

// Font constant
import { FONTS } from './src/theme/fonts';

const Stack = createNativeStackNavigator();

export default function App() {
  const [hasSeenIntro, setHasSeenIntro] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat-Regular': require('./assets/Fonts/Montserrat-Regular.ttf'),
        'Montserrat-SemiBold': require('./assets/Fonts/Montserrat-SemiBold.ttf'),
        'Montserrat-Light': require('./assets/Fonts/Montserrat-Light.ttf'),
        'Montserrat-Medium': require('./assets/Fonts/Montserrat-Medium.ttf'),
        'Montserrat-Bold': require('./assets/Fonts/Montserrat-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const checkIntro = async () => {
      const seen = await AsyncStorage.getItem('hasSeenIntro');
      setHasSeenIntro(seen === 'true');
    };
    checkIntro();
  }, []);

  //Set font mặc định cho toàn bộ <Text>
  useEffect(() => {
    if (!fontsLoaded) return;

    const oldRender = Text.render;
    Text.render = function (...args) {
      const origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        ...origin.props,
        style: [{ fontFamily: FONTS.regular }, origin.props.style],
      });
    };
  }, [fontsLoaded]);
  //
  useEffect(() => {
    const resetIntro = async () => {
      await AsyncStorage.removeItem('hasSeenIntro');
      console.log('Intro reset done');
    };
    resetIntro();
  }, []);
  if (hasSeenIntro === null || !fontsLoaded) return null;
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
