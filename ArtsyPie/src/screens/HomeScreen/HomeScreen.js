import React, { useState } from 'react';
import { View, Text, FlatList, Image, Modal, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from './HomeScreen.styles';

import SearchBar from '../../components/SearchBar/SearchBar';
import CollectionBanner from '../../components/Category/Category';
import ArtCard from '../../components/ArtCard/ArtCard';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import CategoryList from '../../components/CategoryList/CategoryList';
import SearchFilterModal from '../../components/SearchFilterModal/SearchFilterModal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArtworks } from '../../redux/slices/artworksSlice';
import { fetchCatalog } from '../../redux/slices/catalogSlice';

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { artworks = [], loading: artworksLoading, error: artworksError } = useSelector(state => state.artworks);
  const { catalog = [], loading: catalogLoading } = useSelector(state => state.catalog);
  
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredArtworks, setFilteredArtworks] = useState([]);

  // Load data when component mounts
  React.useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchCatalog());
  }, [dispatch]);

  React.useEffect(() => {
    if (artworks && Array.isArray(artworks) && artworks.length > 0) {
      setFilteredArtworks([...artworks]);
    }
  }, [artworks]);

  // Hàm helper để lấy thông tin artist (gán cứng nhưng hợp lý)
  const getArtistInfo = (artistName) => {
    const artistInfoMap = {
      'Vincent van Gogh': { location: 'Amsterdam', gender: 'Male', age: '37 years old' },
      'Pablo Picasso': { location: 'Barcelona', gender: 'Male', age: '91 years old' },
      'Claude Monet': { location: 'Paris', gender: 'Male', age: '86 years old' },
      'Sarah Johnson': { location: 'New York', gender: 'Female', age: '28 years old' },
      'Michael Chen': { location: 'Beijing', gender: 'Male', age: '35 years old' },
      'Emma Rodriguez': { location: 'Madrid', gender: 'Female', age: '31 years old' },
      'David Kim': { location: 'Seoul', gender: 'Male', age: '42 years old' },
      'Lisa Thompson': { location: 'London', gender: 'Female', age: '29 years old' },
      'Alex Rivera': { location: 'Mexico City', gender: 'Male', age: '33 years old' },
      'Maria Garcia': { location: 'Valencia', gender: 'Female', age: '38 years old' },
      'James Wilson': { location: 'Los Angeles', gender: 'Male', age: '45 years old' }
    };
    
    return artistInfoMap[artistName] || { 
      location: 'Unknown City', 
      gender: 'Unknown', 
      age: 'Unknown age' 
    };
  };

  // Dữ liệu artists - lấy từ artworks thực tế
  const artistsData = React.useMemo(() => {
    if (!artworks || !Array.isArray(artworks)) return [];
    
    // Lấy unique artists từ artworks
    const uniqueArtists = [...new Set(artworks.map(item => item.artist))];
    
    // Tạo artist data với thông tin thực tế
    return uniqueArtists.map((artistName, index) => {
      // Đếm số sản phẩm của artist này
      const artistProducts = artworks.filter(item => item.artist === artistName);
      
      // Thông tin artist thực tế (gán cứng nhưng hợp lý)
      const artistInfo = getArtistInfo(artistName);
      
      return {
        id: index + 1,
        name: artistName,
        location: artistInfo.location,
        gender: artistInfo.gender,
        age: artistInfo.age,
        paintings: artistProducts.length,
        avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      };
    });
  }, [artworks]);

  // Hàm xử lý khi nhấn search (Enter hoặc icon search)
  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      // Chuyển đến SearchScreen với search text
      navigation.navigate('SearchScreen', { 
        initialSearchText: searchText,
        initialFilters: activeFilters 
      });
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    setFilterModalVisible(false);
    applyFilters(artworks, filters);
  };

  const applyFilters = (data, filters) => {
    if (!data || !Array.isArray(data)) return;
    
    let filtered = [...data];

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        const price = item.price;
        return price >= min && (max ? price <= max : true);
      });
    }

    // Filter by artist
    if (filters.artist && filters.artist !== 'All') {
      filtered = filtered.filter(item => item.artist === filters.artist);
    }

    setFilteredArtworks(filtered);
  };

  const handleArtCardPress = (item) => {
    navigation.navigate('ProductDetail', { item });
  };

  const handleArtistPress = (artist) => {
    // Navigate to SearchScreen with artist filter
    navigation.navigate('SearchScreen', { 
      artistFilter: artist.name,
      initialSearchText: artist.name,
      initialFilters: { ...activeFilters, artist: artist.name }
    });
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#AA7F60" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>
        We couldn't load the content. Please check your connection and try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchArtworks())}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => (
    <View>
      <View style={styles.titleRow}>
        <Image
          source={require('./../../../assets/Images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titleBold}>ArtsyPie</Text>
      </View>

      <SearchBar 
        searchText={searchText}
        onChangeText={handleSearchTextChange}
        onSearch={handleSearchSubmit}
        onFilterPress={handleFilterPress}
      />
      <CollectionBanner />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>New Arts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {artworksLoading ? (
        <View style={styles.sectionLoading}>
          <ActivityIndicator size="small" color="#AA7F60" />
          <Text style={styles.sectionLoadingText}>Loading...</Text>
        </View>
      ) : artworks && Array.isArray(artworks) && artworks.length > 0 ? (
        <FlatList
          data={artworks.slice(0, 4)}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ArtCard item={item} onPress={() => handleArtCardPress(item)} horizontalCard />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No artworks available</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Artists</Text>
      {artistsData.length > 0 ? (
        <FlatList
          data={artistsData}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.artistsContainer}
          renderItem={({ item }) => (
            <ArtistCard
              name={item.name}
              country={`${item.location} · ${item.paintings} paintings`}
              specialty={`${item.gender}, ${item.age}`}
              avatar={item.avatar}
              onPress={() => handleArtistPress(item)}
            />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No artists available</Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>Catalog</Text>
      <CategoryList data={catalog} style={styles.categoryList}/>
    </View>
  );

  if (artworksLoading && (!artworks || !Array.isArray(artworks) || artworks.length === 0)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (artworksError && (!artworks || !Array.isArray(artworks) || artworks.length === 0)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[{ key: 'main' }]}
        renderItem={renderContent}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <SearchFilterModal
        visible={filterModalVisible}
        onApply={handleFilterApply}
        onClose={() => setFilterModalVisible(false)}
        filters={activeFilters}
      />
    </SafeAreaView>
  );
}
