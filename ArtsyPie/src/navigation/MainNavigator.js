import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IntroScreen from '../screens/IntroScreen/IntroScreen';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkIntro = async () => {
      const seen = await AsyncStorage.getItem('hasSeenIntro');
      setInitialRoute(seen === 'true' ? 'AppNavigator' : 'Intro');
    };
    checkIntro();
  }, []);

  if (!initialRoute) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="AppNavigator" component={AppNavigator} />
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
    </Stack.Navigator>
  );
}
