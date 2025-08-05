import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './WishlistScreen.styles';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';

// Helper function to map image filenames to require paths
const getImageSource = (imageName) => {
  const imageMap = {
    'impressionlsm.jpg': require('../../../assets/Images/Product/impressionlsm.jpg'),
    'modernlsm.jpg': require('../../../assets/Images/Product/modernlsm.jpg'),
    'plus1.jpg': require('../../../assets/Images/Product/plus1.jpg'),
    'plus2.jpg': require('../../../assets/Images/Product/plus2.jpg'),
    'plus3.jpg': require('../../../assets/Images/Product/plus3.jpg'),
    'plus4.jpg': require('../../../assets/Images/Product/plus4.jpg'),
    'pool.jpg': require('../../../assets/Images/Product/pool.jpg'),
    'sportman.jpg': require('../../../assets/Images/Product/sportman.jpg'),
  };
  
  return imageMap[imageName] || require('../../../assets/Images/Product/impressionlsm.jpg');
};

export default function WishlistScreen() {
  const navigation = useNavigation();

  // Mock wishlist data - in real app this would come from Redux state
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'Impressionist Landscape',
      artist: 'Claude Monet',
      price: 2500000,
      image: 'impressionlsm.jpg',
      category: 'Landscape',
      addedDate: '2025-08-05',
      inStock: true,
      discount: 0,
    },
    {
      id: '2',
      name: 'Modern Abstract',
      artist: 'Pablo Picasso',
      price: 1800000,
      image: 'modernlsm.jpg',
      category: 'Abstract',
      addedDate: '2025-08-04',
      inStock: true,
      discount: 15,
    },
    {
      id: '3',
      name: 'Swimming Pool',
      artist: 'David Hockney',
      price: 3200000,
      image: 'pool.jpg',
      category: 'Contemporary',
      addedDate: '2025-08-03',
      inStock: false,
      discount: 0,
    },
    {
      id: '4',
      name: 'Portrait Study',
      artist: 'Vincent van Gogh',
      price: 1500000,
      image: 'plus1.jpg',
      category: 'Portrait',
      addedDate: '2025-08-02',
      inStock: true,
      discount: 10,
    },
    {
      id: '5',
      name: 'Still Life Composition',
      artist: 'Paul Cézanne',
      price: 2200000,
      image: 'plus2.jpg',
      category: 'Still Life',
      addedDate: '2025-08-01',
      inStock: true,
      discount: 0,
    },
  ]);

  const [filteredItems, setFilteredItems] = useState(wishlistItems);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc'); 

  const categories = [
    { id: 'all', name: 'All', count: wishlistItems.length },
    { id: 'landscape', name: 'Landscape', count: wishlistItems.filter(item => item.category === 'Landscape').length },
    { id: 'abstract', name: 'Abstract', count: wishlistItems.filter(item => item.category === 'Abstract').length },
    { id: 'contemporary', name: 'Contemporary', count: wishlistItems.filter(item => item.category === 'Contemporary').length },
    { id: 'portrait', name: 'Portrait', count: wishlistItems.filter(item => item.category === 'Portrait').length },
    { id: 'still life', name: 'Still Life', count: wishlistItems.filter(item => item.category === 'Still Life').length },
  ];

  useEffect(() => {
    filterAndSortItems();
  }, [selectedCategory, sortBy, sortOrder, wishlistItems]);

  const filterAndSortItems = () => {
    let filtered = wishlistItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.addedDate) - new Date(b.addedDate);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  };

  const handleItemPress = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  const handleRemoveFromWishlist = (itemId) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setWishlistItems(prev => prev.filter(item => item.id !== itemId));
          }
        }
      ]
    );
  };

  const handleAddToCart = (item) => {
    // In real app, you would dispatch an action to add to cart
    Alert.alert(
      'Added to Cart',
      `${item.name} has been added to your cart!`,
      [{ text: 'OK' }]
    );
  };

  const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to clear your entire wishlist? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            setWishlistItems([]);
          }
        }
      ]
    );
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <TouchableOpacity
        style={styles.itemImageContainer}
        onPress={() => handleItemPress(item)}
      >
        <Image 
          source={getImageSource(item.image)}
          style={styles.itemImage} 
        />
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <TouchableOpacity
          style={styles.itemDetails}
          onPress={() => handleItemPress(item)}
        >
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemArtist}>by {item.artist}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          
          <View style={styles.priceContainer}>
            {item.discount > 0 ? (
              <>
                <Text style={styles.originalPrice}>{formatCurrency(item.price)}</Text>
                <Text style={styles.discountedPrice}>
                  {formatCurrency(calculateDiscountedPrice(item.price, item.discount))}
                </Text>
              </>
            ) : (
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !item.inStock && styles.addToCartButtonDisabled
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={!item.inStock}
          >
            <Ionicons name="cart-outline" size={16} color="#fff" />
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromWishlist(item.id)}
          >
            <Ionicons name="heart-dislike" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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

  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>
      <View style={styles.sortButtons}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'date' && styles.sortButtonSelected
          ]}
          onPress={() => setSortBy('date')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'date' && styles.sortButtonTextSelected
          ]}>
            Date
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'price' && styles.sortButtonSelected
          ]}
          onPress={() => setSortBy('price')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'price' && styles.sortButtonTextSelected
          ]}>
            Price
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'name' && styles.sortButtonSelected
          ]}
          onPress={() => setSortBy('name')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'name' && styles.sortButtonTextSelected
          ]}>
            Name
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.sortOrderButton}
        onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        <Ionicons 
          name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
          size={16} 
          color={COLORS.primary} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptyMessage}>
        Start exploring our collection and add your favorite artworks to your wishlist.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse Artworks</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWishlistContent = () => (
    <View style={styles.wishlistContent}>
      <View style={styles.wishlistHeader}>
        <Text style={styles.wishlistTitle}>
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in wishlist
        </Text>
        {wishlistItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearWishlistButton}
            onPress={handleClearWishlist}
          >
            <Text style={styles.clearWishlistButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredItems}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wishlistList}
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
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Category Filter */}
      {wishlistItems.length > 0 && renderCategoryFilter()}

      {/* Sort Options */}
      {wishlistItems.length > 0 && renderSortOptions()}

      {/* Content */}
      <View style={styles.content}>
        {wishlistItems.length === 0 ? (
          renderEmptyState()
        ) : filteredItems.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.noResultsTitle}>No Items Found</Text>
            <Text style={styles.noResultsMessage}>
              Try adjusting your category filter.
            </Text>
          </View>
        ) : (
          renderWishlistContent()
        )}
      </View>
    </SafeAreaView>
  );
} 