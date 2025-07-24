import React, { useRef, useState,useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import styles from './IntroScreen.styles';
import ExploreButton from '../../components/ExploreButton/ExploreButton';
import { fetchBanners } from '../../redux/slices/bannerSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function IntroScreen({ navigation }) {
  const dispatch = useDispatch();
  const { data: banners, loading } = useSelector((state) => state.banners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { height, width } = Dimensions.get('window');

  useEffect(() => {
    dispatch(fetchBanners());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  const handleExplore = () => {
    // Chỉ cần navigate
    navigation.replace('AppNavigator');
  };

  const handleLogin = () => {
    // Chỉ cần navigate
    navigation.replace('AuthNavigator', { screen: 'LoginScreen' });
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* slide */}
        <View style={{ height: height * 0.7 }}>
        <FlatList
          ref={flatListRef}
          data={banners}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Dot*/}
       <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>

      {/* Bottom Button + Login */}
      <View style={styles.bottomContent}>
        <ExploreButton
          title="Let's Explore"
          icon="arrow-forward-outline"
          onPress={handleExplore}
        />
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>
            Already Have an Account?{' '}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
