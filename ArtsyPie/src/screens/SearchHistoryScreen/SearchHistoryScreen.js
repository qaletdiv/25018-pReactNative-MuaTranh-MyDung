import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './SearchHistoryScreen.styles';
import { COLORS } from '../../theme/colors';

export default function SearchHistoryScreen() {
  const navigation = useNavigation();

  // Mock search history data - in real app this would come from Redux state
  const [searchHistory, setSearchHistory] = useState([
    {
      id: '1',
      query: 'landscape painting',
      timestamp: '2025-08-05 14:30',
      resultCount: 12,
      category: 'Landscape',
    },
    {
      id: '2',
      query: 'modern art',
      timestamp: '2025-08-05 10:15',
      resultCount: 8,
      category: 'Modern',
    },
    {
      id: '3',
      query: 'impressionist',
      timestamp: '2025-08-04 16:45',
      resultCount: 15,
      category: 'Impressionist',
    },
    {
      id: '4',
      query: 'abstract',
      timestamp: '2025-08-04 09:20',
      resultCount: 6,
      category: 'Abstract',
    },
    {
      id: '5',
      query: 'portrait',
      timestamp: '2025-08-03 13:10',
      resultCount: 20,
      category: 'Portrait',
    },
    {
      id: '6',
      query: 'oil painting',
      timestamp: '2025-08-03 11:30',
      resultCount: 18,
      category: 'Oil',
    },
    {
      id: '7',
      query: 'watercolor',
      timestamp: '2025-08-02 15:25',
      resultCount: 9,
      category: 'Watercolor',
    },
    {
      id: '8',
      query: 'still life',
      timestamp: '2025-08-02 08:45',
      resultCount: 11,
      category: 'Still Life',
    },
  ]);

  const [filteredHistory, setFilteredHistory] = useState(searchHistory);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', count: searchHistory.length },
    { id: 'landscape', name: 'Landscape', count: searchHistory.filter(item => item.category === 'Landscape').length },
    { id: 'modern', name: 'Modern', count: searchHistory.filter(item => item.category === 'Modern').length },
    { id: 'impressionist', name: 'Impressionist', count: searchHistory.filter(item => item.category === 'Impressionist').length },
    { id: 'abstract', name: 'Abstract', count: searchHistory.filter(item => item.category === 'Abstract').length },
    { id: 'portrait', name: 'Portrait', count: searchHistory.filter(item => item.category === 'Portrait').length },
  ];

  useEffect(() => {
    filterHistory();
  }, [searchText, selectedCategory, searchHistory]);

  const filterHistory = () => {
    let filtered = searchHistory;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(item =>
        item.query.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  };

  const handleSearchItemPress = (item) => {
    // Navigate to search results with the query
    navigation.navigate('SearchScreen', { 
      initialQuery: item.query,
      category: item.category 
    });
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      'Delete Search',
      'Are you sure you want to delete this search from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setSearchHistory(prev => prev.filter(item => item.id !== itemId));
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all search history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            setSearchHistory([]);
          }
        }
      ]
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => handleSearchItemPress(item)}
    >
      <View style={styles.searchItemLeft}>
        <View style={styles.searchIconContainer}>
          <Ionicons name="search" size={16} color="#666" />
        </View>
        <View style={styles.searchItemInfo}>
          <Text style={styles.searchQuery}>{item.query}</Text>
          <View style={styles.searchMeta}>
            <Text style={styles.searchCategory}>{item.category}</Text>
            <Text style={styles.searchTime}>{formatTimestamp(item.timestamp)}</Text>
            <Text style={styles.searchResults}>{item.resultCount} results</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Ionicons name="close" size={16} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryChip,
            selectedCategory === category.id && styles.categoryChipSelected
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text style={[
            styles.categoryChipText,
            selectedCategory === category.id && styles.categoryChipTextSelected
          ]}>
            {category.name} ({category.count})
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Search History</Text>
      <Text style={styles.emptyMessage}>
        Your search history will appear here. Start searching for artworks to see your history.
      </Text>
    </View>
  );

  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {filteredHistory.length} search{filteredHistory.length !== 1 ? 'es' : ''}
        </Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAll}
          >
            <Text style={styles.clearAllButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredHistory}
        renderItem={renderSearchItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.searchList}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in history..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchText('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      {searchHistory.length > 0 && renderCategoryFilter()}

      {/* Content */}
      <View style={styles.content}>
        {searchHistory.length === 0 ? (
          renderEmptyState()
        ) : filteredHistory.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.noResultsTitle}>No Results Found</Text>
            <Text style={styles.noResultsMessage}>
              Try adjusting your search or category filter.
            </Text>
          </View>
        ) : (
          renderSearchResults()
        )}
      </View>
    </SafeAreaView>
  );
} 