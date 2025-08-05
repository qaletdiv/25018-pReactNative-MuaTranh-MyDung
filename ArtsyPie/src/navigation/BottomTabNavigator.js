// src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import CartScreen from '../screens/CartScreen/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen/FavoritesScreen';
import AccountScreen from '../screens/AccountScreen/AccountScreen';

const Tab = createBottomTabNavigator();


const AuthenticatedCartScreen = ({ navigation }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  

  
  React.useEffect(() => {
    if (!isAuthenticated) {

      navigation.navigate('LoginScreen');
    }
  }, [isAuthenticated, navigation]);

  if (!isAuthenticated) {
    return null;
  }

  return <CartScreen />;
};

const AuthenticatedFavoritesScreen = ({ navigation }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  

  
  React.useEffect(() => {
    if (!isAuthenticated) {

      navigation.navigate('LoginScreen');
    }
  }, [isAuthenticated, navigation]);

  if (!isAuthenticated) {
    return null;
  }

  return <FavoritesScreen />;
};

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
              iconName = 'cart';
              break;
            case 'Account':
              iconName = 'person';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Saved" component={AuthenticatedFavoritesScreen} />
      <Tab.Screen 
        name="Cart" 
        component={AuthenticatedCartScreen}
        options={{
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
