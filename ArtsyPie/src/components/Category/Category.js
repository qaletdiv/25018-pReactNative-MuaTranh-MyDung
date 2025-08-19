import React, { useState, useRef } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Dimensions, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './Category.styles';

const { width: screenWidth } = Dimensions.get('window');

// Mock data cho banner bộ sưu tập với hình ảnh thật
const collectionBanners = [
  {
    id: 1,
    title: 'Featured Collections',
    subtitle: 'FEATURED COLLECTIONS',
    description: 'Discover the most outstanding artworks',
    image: require('../../../assets/Images/Header/header1.jpg'),
    count: 12,
    isActive: true,
    route: 'ProductList',
    params: { collection: 'featured' }
  },
  {
    id: 2,
    title: 'Special Promotions',
    subtitle: 'SPECIAL PROMOTIONS',
    description: 'Up to 50% off for new collections',
    image: require('../../../assets/Images/Header/header2.jpg'),
    count: 8,
    isActive: false,
    route: 'ProductList',
    params: { collection: 'promotions' }
  },
  {
    id: 3,
    title: 'Latest Works',
    subtitle: 'LATEST WORKS',
    description: 'The newest creations from talented artists',
    image: require('../../../assets/Images/Header/header3.jpg'),
    count: 15,
    isActive: false,
    route: 'ProductList',
    params: { collection: 'latest' }
  },
  {
    id: 4,
    title: 'Exclusive Collections',
    subtitle: 'EXCLUSIVE COLLECTIONS',
    description: 'Exclusive collections only available at ArtsyPie',
    image: require('../../../assets/Images/Product/impressionlsm.jpg'),
    count: 6,
    isActive: false,
    route: 'ProductList',
    params: { collection: 'exclusive' }
  }
];

export default function Category() {
  const [activeBanner, setActiveBanner] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handleBannerPress = (banner) => {
    // Navigate to the appropriate screen
    if (banner.route) {
      navigation.navigate(banner.route, banner.params);
    } else {
      // Fallback alert if no route specified
      Alert.alert(
        'Bộ sưu tập',
        `Bạn đã chọn: ${banner.title}`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderBannerItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.bannerItem}
      onPress={() => handleBannerPress(item)}
      activeOpacity={0.9}
    >
      <Image source={item.image} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerDescription}>{item.description}</Text>
          <View style={styles.bannerFooter}>
            <Text style={styles.bannerCount}>{item.count} items</Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>View Now</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDotIndicator = () => (
    <View style={styles.dotContainer}>
      {collectionBanners.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeBanner && styles.activeDot
          ]}
        />
      ))}
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveBanner(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>New collection</Text>
      
      <FlatList
        ref={flatListRef}
        data={collectionBanners}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={screenWidth - 40} // 40 = padding horizontal
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        contentContainerStyle={styles.bannerList}
      />
      
      {renderDotIndicator()}
    </View>
  );
}
