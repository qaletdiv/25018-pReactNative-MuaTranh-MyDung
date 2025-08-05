import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/SearchBar/SearchBar';
import LastSearches from '../../components/LastSearches/LastSearches';
import PopularSearches from '../../components/PopularSearches/PopularSearches';
import SearchFilterModal from '../../components/SearchFilterModal/SearchFilterModal';
import ArtCard from '../../components/ArtCard/ArtCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArtworks } from '../../redux/slices/artworksSlice';
import { useNavigation } from '@react-navigation/native';
import styles from './SearchScreen.styles';

export default function SearchScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { artworks, loading } = useSelector(state => state.artworks);
  
  const route = useNavigation().getState().routes.find(r => r.name === 'SearchScreen');
  const initialSearchText = route?.params?.initialSearchText || '';
  const initialFilters = route?.params?.initialFilters || {};
  
  const [searchText, setSearchText] = useState(initialSearchText);
  const [searchResults, setSearchResults] = useState([]);
  const [lastSearches, setLastSearches] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [filteredResults, setFilteredResults] = useState([]);

  // Load data when component mounts
  React.useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  // const popularData = ['Tranh sơn dầu', 'Tranh phong cảnh', 'Tranh hiện đại'];

  // Tự động search nếu có initialSearchText
  useEffect(() => {
    if (initialSearchText) {
      handleSearchSubmit();
    }
  }, []);

  // Hàm chỉ cập nhật text, không search ngay
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  // Hàm thực hiện search khi nhấn Enter hoặc icon search
  const handleSearchSubmit = () => {
    if (searchText.trim() === '') {
      setSearchResults([]);
      setFilteredResults([]);
      return;
    }

    // Chuẩn hóa chuỗi tìm kiếm
    const normalizedText = searchText.toLowerCase().normalize("NFC");

    const results = artworks.filter(
      (item) => {
        // Chuẩn hóa dữ liệu gốc trước khi so sánh
        const normalizedTitle = item.title.toLowerCase().normalize("NFC");
        const normalizedArtist = item.artist.toLowerCase().normalize("NFC");
        
        return normalizedTitle.includes(normalizedText) || normalizedArtist.includes(normalizedText);
      }
    );

    setSearchResults(results);
    applyFilters(results, activeFilters);

    // Cập nhật lastSearches nếu không trùng lặp
    if (!lastSearches.includes(searchText.trim())) {
      setLastSearches([searchText.trim(), ...lastSearches].slice(0, 10));
    }
  };

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

    setFilteredResults(filtered);
  };

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    applyFilters(searchResults, filters);
  };

  const handleClearLastSearches = () => {
    setLastSearches([]);
  };

  const handleRemoveSearch = (itemToRemove) => {
    setLastSearches((prev) => prev.filter((item) => item !== itemToRemove));
  };

  const handleArtCardPress = (item) => {
    navigation.navigate('ProductDetail', { item });
  };

  const renderArtCard = ({ item }) => (
    <ArtCard item={item} onPress={handleArtCardPress} compact={true} />
  );

  const renderSearchResults = () => {
    const dataToShow = searchText ? filteredResults : [];
    
    if (dataToShow.length === 0 && searchText) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Không tìm thấy kết quả nào.</Text>
          <Text style={styles.noResultsSubtext}>Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArtCard}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContainer}
        ListHeaderComponent={
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {dataToShow.length} sản phẩm
            </Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={styles.filterButtonText}>
                Bộ lọc {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.types && activeFilters.types.length > 0) count++;
    if (activeFilters.styles && activeFilters.styles.length > 0) count++;
    if (activeFilters.sizes && activeFilters.sizes.length > 0) count++;
    if (activeFilters.orientations && activeFilters.orientations.length > 0) count++;
    if (activeFilters.priceRange && activeFilters.priceRange[1] < 20000000) count++;
    return count;
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        showBack
        editable
        searchText={searchText}
        onChangeText={handleSearchTextChange}
        onSearch={handleSearchSubmit}
        onBackPress={() => navigation.goBack()}
      />

      {searchText === '' ? (
        <>
          <LastSearches
            searches={lastSearches}
            onClear={handleClearLastSearches}
            onRemove={handleRemoveSearch}
          />
          <PopularSearches data={artworks} onArtCardPress={handleArtCardPress} />
        </>
      ) : (
        <>
          {renderSearchResults()}
        </>
      )}

      <SearchFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        filters={activeFilters}
      />
    </SafeAreaView>
  );
}
