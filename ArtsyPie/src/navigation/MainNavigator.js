import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { restoreToken } from '../redux/slices/authSlice';

import IntroScreen from '../screens/IntroScreen/IntroScreen';
import RestartScreen from '../screens/RestartScreen/RestartScreen';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Chỉ dùng useEffect để phục hồi token nếu có
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          const userData = await AsyncStorage.getItem('userData');
          dispatch(restoreToken({ token: userToken, user: userData ? JSON.parse(userData) : null }));
        }
      } catch (e) {
        console.error(e);
      }
      
      // Thêm delay 5 giây
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    };
    bootstrapAsync();
  }, [dispatch]);

  if (isLoading) {
    return <RestartScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        // Nếu ĐÃ ĐĂNG NHẬP, vào thẳng APP
        <Stack.Screen name="AppNavigator" component={AppNavigator} />
      ) : (
        // Nếu CHƯA ĐĂNG NHẬP, render tất cả các luồng và BẮT ĐẦU TỪ INTRO
        <>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          <Stack.Screen name="AppNavigator" component={AppNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}
