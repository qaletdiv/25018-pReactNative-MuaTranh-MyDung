// src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen/HomeScreen';

import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const Placeholder = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Saved':
              iconName = 'heart';
              break;
            case 'Cart':
              iconName = 'shopping-cart';
              break;
            case 'Account':
              iconName = 'user';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          position: 'absolute',
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="Saved" children={() => <Placeholder name="Saved" />} />
      <Tab.Screen name="Cart" children={() => <Placeholder name="Cart" />} />
      <Tab.Screen name="Account" children={() => <Placeholder name="Account" />} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
