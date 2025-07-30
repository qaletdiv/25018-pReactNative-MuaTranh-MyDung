import React, { useState } from 'react';
import { View, Text, FlatList, Image, Modal, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from './HomeScreen.styles';

import SearchBar from '../../components/SearchBar/SearchBar';
import Category from '../../components/Category/Category';
import ArtCard from '../../components/ArtCard/ArtCard';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import CategoryList from '../../components/CategoryList/CategoryList';
import SearchFilterModal from '../../components/SearchFilterModal/SearchFilterModal';
import { catalogData } from '../../data/catalogData';
import artworksData from '../../data/artworksData';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredArtworks, setFilteredArtworks] = useState([...artworksData]);

  // Dữ liệu artists 
  const artistsData = [
    {
      id: 1,
      name: "Jessica Math",
      country: "Italy",
      paintings: 12,
      avatar: "https://i.pravatar.cc/150?img=5",
      specialty: "Abstract"
    },
    {
      id: 2,
      name: "Marco Rossi",
      country: "Italy", 
      paintings: 8,
      avatar: "https://i.pravatar.cc/150?img=12",
      specialty: "Landscape"
    },
    {
      id: 3,
      name: "Sophie Chen",
      country: "China",
      paintings: 15,
      avatar: "https://i.pravatar.cc/150?img=23",
      specialty: "Modern"
    },
    {
      id: 4,
      name: "Alex Johnson",
      country: "USA",
      paintings: 6,
      avatar: "https://i.pravatar.cc/150?img=34",
      specialty: "Portrait"
    },
    {
      id: 5,
      name: "Elena Petrova",
      country: "Russia",
      paintings: 10,
      avatar: "https://i.pravatar.cc/150?img=45",
      specialty: "Impressionist"
    },
    {
      id: 6,
      name: "Carlos Mendez",
      country: "Spain",
      paintings: 9,
      avatar: "https://i.pravatar.cc/150?img=56",
      specialty: "Contemporary"
    }
  ];

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

  // Hàm chỉ cập nhật text, không search ngay
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  // Hàm mở filter modal
  const handleFilterPress = () => {
    console.log('HomeScreen: Filter button pressed!');
    setFilterModalVisible(true);
  };

  // Hàm áp dụng filter
  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    applyFilters(filteredArtworks, filters);
    setFilterModalVisible(false);
  };

  // Hàm áp dụng filter vào dữ liệu
  const applyFilters = (data, filters) => {
    let filtered = [...data];

    // Lọc theo loại hình
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(item => filters.types.includes(item.type));
    }

    // Lọc theo phong cách
    if (filters.styles && filters.styles.length > 0) {
      filtered = filtered.filter(item => filters.styles.includes(item.style));
    }

    // Lọc theo kích thước
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(item => filters.sizes.includes(item.size));
    }

    // Lọc theo hướng tranh
    if (filters.orientations && filters.orientations.length > 0) {
      filtered = filtered.filter(item => filters.orientations.includes(item.orientation));
    }

    // Lọc theo khoảng giá
    if (filters.priceRange) {
      filtered = filtered.filter(item => 
        item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
      );
    }

    // Sắp xếp
    if (filters.sort) {
      switch (filters.sort) {
        case 'Newest':
          filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'Price: Low to High':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
    }

    setFilteredArtworks(filtered);
  };

  const handleArtCardPress = (item) => {
    navigation.navigate('ProductDetail', { item });
  };

  const handleArtistPress = (artist) => {
    Alert.alert('Artist', `View all works by ${artist.name}\nSpecialty: ${artist.specialty}\nCountry: ${artist.country}`);
  };

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
      <Category />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>New Arts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredArtworks.slice(0, 4)}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ArtCard item={item} onPress={() => handleArtCardPress(item)} horizontalCard />
        )}
      />

      <Text style={styles.sectionTitle}>Artists</Text>
      <FlatList
        data={artistsData}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ArtistCard
            name={item.name}
            country={`${item.country} · ${item.paintings} paintings`}
            avatar={item.avatar}
            onPress={() => handleArtistPress(item)}
          />
        )}
      />
      <Text style={styles.sectionTitle}>Catalog</Text>
      <CategoryList data={catalogData} />
    </View>
  );

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
