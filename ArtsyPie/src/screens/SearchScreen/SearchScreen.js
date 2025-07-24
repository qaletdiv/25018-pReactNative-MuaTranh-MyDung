import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import LastSearches from '../../components/LastSearches/LastSearches';
import PopularSearches from '../../components/PopularSearches/PopularSearches';
import SearchFilterModal from '../../components/SearchFilterModal/SearchFilterModal';
import ArtCard from '../../components/ArtCard/ArtCard';
import artworksData from '../../data/artworksData';
import { useNavigation } from '@react-navigation/native';
import styles from './SearchScreen.styles';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [lastSearches, setLastSearches] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredResults, setFilteredResults] = useState([]);

  // const popularData = ['Tranh sơn dầu', 'Tranh phong cảnh', 'Tranh hiện đại'];

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setSearchResults([]);
      setFilteredResults([]);
      return;
    }

    // Chuẩn hóa chuỗi tìm kiếm
    const normalizedText = text.toLowerCase().normalize("NFC");

    const results = artworksData.filter(
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
    if (!lastSearches.includes(text.trim())) {
      setLastSearches([text.trim(), ...lastSearches].slice(0, 5));
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
        case 'Mới nhất':
          filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'Giá thấp đến cao':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Giá cao đến thấp':
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
    Alert.alert('Thông tin tranh', `${item.title}\nNghệ sĩ: ${item.artist}\nGiá: ${item.price.toLocaleString()} VNĐ`);
  };

  const renderArtCard = ({ item }) => (
    <ArtCard item={item} onPress={handleArtCardPress} />
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
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContainer}
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
    <View style={styles.container}>
      <SearchBar
        showBack
        editable
        searchText={searchText}
        onChangeText={handleSearch}
        onBackPress={() => navigation.goBack()}
      />

      {searchText === '' ? (
        <>
          <LastSearches
            searches={lastSearches}
            onClear={handleClearLastSearches}
            onRemove={handleRemoveSearch}
          />
          <PopularSearches data={artworksData} />
        </>
      ) : (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Kết quả tìm kiếm ({filteredResults.length})
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
          {renderSearchResults()}
        </>
      )}

      <SearchFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        filters={activeFilters}
      />
    </View>
  );
}
