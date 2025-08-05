import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/SearchBar/SearchBar';
import ArtCard from '../../components/ArtCard/ArtCard';
import SearchFilterModal from '../../components/SearchFilterModal/SearchFilterModal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArtworks } from '../../redux/slices/artworksSlice';
import styles from './ProductListScreen.styles';

export default function ProductListScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { artworks, loading } = useSelector(state => state.artworks);
  
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Load data when component mounts
  React.useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  // Update filtered products when artworks change
  React.useEffect(() => {
    setFilteredProducts([...artworks]);
  }, [artworks]);

  // Hàm chỉ cập nhật text, không search ngay
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  // Hàm thực hiện search khi nhấn Enter hoặc icon search
  const handleSearchSubmit = () => {
    if (searchText.trim() === '') {
      setFilteredProducts([...artworks]);
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

    setFilteredProducts(results);
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    applyFilters(filteredProducts, filters);
    setFilterModalVisible(false);
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

    setFilteredProducts(filtered);
  };

  const renderProduct = ({ item }) => (
    <ArtCard item={item} compact={true} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Không tìm thấy sản phẩm</Text>
      <Text style={styles.emptyStateText}>
        Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar với nút back */}
      <SearchBar
        showBack
        editable
        searchText={searchText}
        onChangeText={handleSearchTextChange}
        onSearch={handleSearchSubmit}
        onBackPress={() => navigation.goBack()}
        onFilterPress={handleFilterPress}
      />

      {/* Product Count */}
      <View style={styles.productCount}>
        <Text style={styles.productCountText}>
          {filteredProducts.length} sản phẩm
        </Text>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Filter Modal */}
      <SearchFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterApply}
        filters={activeFilters}
      />
    </View>
  );
} 