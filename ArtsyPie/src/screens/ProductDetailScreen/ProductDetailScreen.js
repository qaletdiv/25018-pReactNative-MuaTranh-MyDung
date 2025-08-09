import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ProductDetailScreen.styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { addToCartAsync } from '../../redux/slices/cartSlice';
import { addToFavoritesAsync, removeFromFavoritesAsync, selectIsFavorite, toggleFavorite, removeFromFavorites } from '../../redux/slices/favoritesSlice';
import { fetchArtworks } from '../../redux/slices/artworksSlice';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { item } = route.params || {};
  const { isAuthenticated } = useSelector(state => state.auth);
  const { artworks } = useSelector((state) => state.artworks);
  const isFavorite = useSelector(state => selectIsFavorite(state, item?.id));

  // Load artworks data when component mounts
  React.useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showNoWorksModal, setShowNoWorksModal] = useState(false);
  const [showArtistPopup, setShowArtistPopup] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    size: 'Standard',
    frame: 'No Frame',
    quantity: 1,
  });

  // Auto slider timer
  const sliderRef = useRef(null);

  // Sử dụng mảng images từ dữ liệu sản phẩm, nếu không có thì fallback về image đơn
  let images = [];
  
  if (item?.images && Array.isArray(item.images)) {
    images = item.images;
  } else if (item?.image) {
    // Nếu có image đơn, tạo mảng với 1 item
    images = [{ uri: item.image }];
  }

  // Đảm bảo images luôn có ít nhất 1 item và format đúng
  const safeImages = images.length > 0 ? images : [{ uri: 'https://picsum.photos/400/600?random=1' }];

  // Debug log để kiểm tra dữ liệu


  // Lấy danh sách tác phẩm của cùng tác giả
  const getArtistWorks = () => {
    if (!item?.artist || !artworks) return [];
    return artworks.filter(art => art.artist === item.artist && art.id !== item.id);
  };

  // Reset currentImageIndex khi safeImages thay đổi
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [safeImages]);

  // Auto slider effect 
  useEffect(() => {
    if (safeImages.length <= 1) return;

    const timer = setInterval(() => {
      // Đảm bảo currentImageIndex là số hợp lệ
      const validCurrentIndex = isNaN(currentImageIndex) || currentImageIndex < 0 ? 0 : currentImageIndex;
      const nextIndex = (validCurrentIndex + 1) % safeImages.length;
      
      try {
        sliderRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setCurrentImageIndex(nextIndex);
      } catch (error) {
        // Fallback: sử dụng scrollToOffset nếu scrollToIndex thất bại
        sliderRef.current?.scrollToOffset({
          x: nextIndex * width,
          animated: true
        });
        setCurrentImageIndex(nextIndex);
      }
    }, 3000); // 3 giây

    return () => clearInterval(timer);
  }, [currentImageIndex, safeImages.length]);

  // data options
  const sizeOptions = ['Standard', 'Large', 'Extra Large'];
  const frameOptions = ['No Frame', 'Simple Frame', 'Premium Frame'];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'Please login to add to cart');
      navigation.navigate('LoginScreen');
      return;
    }

    if (!selectedOptions.size || !selectedOptions.frame) {
      Alert.alert('Error', 'Please select size and frame');
      return;
    }

    try {
      const productData = {
        productId: item.id,
        quantity: selectedOptions.quantity || 1,
        product: {
          id: item.id,
          name: item.name || item.title,
          price: item.price,
          image: item.image,
          artist: item.artist,
          description: item.description,
          type: item.type,
          style: item.style
        },
        selectedOptions: {
          size: selectedOptions.size,
          frame: selectedOptions.frame
        }
      };

      await dispatch(addToCartAsync(productData)).unwrap();
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', error || 'Cannot add to cart');
    }
  };

  const handleConfirmAddToCart = async () => {
    setShowOptionsModal(false);
    await handleAddToCart();
  };

  const handleAddToFavorite = async () => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigation.navigate('LoginScreen');
      return;
    }

    // Sử dụng local state trực tiếp để đảm bảo hoạt động
    if (isFavorite) {
      dispatch(removeFromFavorites(item.id));
    } else {
      dispatch(toggleFavorite(item));
    }
  };

  const handleArtistPress = () => {
    setShowArtistPopup(true);
  };

  const handleArtistWorkPress = (artwork) => {
    setShowArtistModal(false);
    navigation.navigate('ProductDetail', { item: artwork });
  };

  const updateOption = (type, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const updateQuantity = (increment) => {
    const newQuantity = selectedOptions.quantity + increment;
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateOption('quantity', newQuantity);
    }
  };

  const renderImageCarousel = () => (
    <View style={styles.imageContainer}>
      <FlatList
        ref={sliderRef}
        data={safeImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `image-${index}`}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          // Đảm bảo index hợp lệ
          const validIndex = Math.max(0, Math.min(index, safeImages.length - 1));
          setCurrentImageIndex(validIndex);
        }}
        renderItem={({ item: imageItem, index }) => {
      
          let imageSource;
          
          if (typeof imageItem === 'string') {
            imageSource = { uri: imageItem };
          } else if (imageItem && typeof imageItem === 'object' && imageItem.uri) {
            imageSource = imageItem;
          } else {
            // Fallback
            imageSource = { uri: 'https://picsum.photos/400/600?random=1' };
          }
          
          return (
            <Image
              source={imageSource}
              style={styles.productImage}
              resizeMode="cover"
              onError={(error) => {
        
              }}
            />
          );
        }}
      />

      {/* Image indicators - chỉ hiển thị khi có nhiều hơn 1 ảnh */}
      {safeImages.length > 1 && (
        <View style={styles.imageIndicators}>
          {safeImages.map((_, index) => (
            <View
              key={`indicator-${index}`}
              style={[
                styles.indicator,
                index === (isNaN(currentImageIndex) ? 0 : currentImageIndex) && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

    const renderProductInfo = () => {
    const actualPrice = item?.price || 0;
    const originalPrice = actualPrice * 1.05; // +5% 
    const discountedPrice = actualPrice; // Giá thực tế

    return (
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item?.title || 'Product Name'}</Text>
        <TouchableOpacity onPress={handleArtistPress}>
          <Text style={styles.artistName}>By {item?.artist || 'Artist'}</Text>
        </TouchableOpacity>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>{formatCurrency(originalPrice)}</Text>
          <Text style={styles.discountedPrice}>{formatCurrency(discountedPrice)}</Text>
        </View>
      </View>
    );
  };

  const renderDescription = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {item?.description || 'This is a unique artwork created by a talented artist. The piece showcases creativity and masterful technique, offering viewers deep emotions and a new perspective on modern art.'}
      </Text>
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Specifications</Text>
      <View style={styles.specItem}>
        <Text style={styles.specLabel}>Size:</Text>
        <Text style={styles.specValue}>80cm x 120cm</Text>
      </View>
      <View style={styles.specItem}>
        <Text style={styles.specLabel}>Material:</Text>
        <Text style={styles.specValue}>{item?.type || 'Oil Painting'}</Text>
      </View>
      <View style={styles.specItem}>
        <Text style={styles.specLabel}>Style:</Text>
        <Text style={styles.specValue}>{item?.style || 'Modern'}</Text>
      </View>
      <View style={styles.specItem}>
        <Text style={styles.specLabel}>Year Created:</Text>
        <Text style={styles.specValue}>2024</Text>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.addToCartButton} onPress={() => setShowOptionsModal(true)}>
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]} 
        onPress={handleAddToFavorite}
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite ? "#fff" : "#FF6B6B"} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderArtistWorkItem = ({ item: artwork }) => (
    <TouchableOpacity 
      style={styles.artistWorkItem}
      onPress={() => handleArtistWorkPress(artwork)}
    >
      <Image 
        source={{ uri: artwork.image }} 
        style={styles.artistWorkImage}
        resizeMode="cover"
      />
      <View style={styles.artistWorkInfo}>
        <Text style={styles.artistWorkTitle}>{artwork.title}</Text>
        <Text style={styles.artistWorkPrice}>{formatCurrency(artwork.price)}</Text>
      </View>
      <View style={styles.artistWorkTag}>
        <Text style={styles.artistWorkTagText}>New</Text>
      </View>
    </TouchableOpacity>
  );

  const renderArtistModal = () => (
    <Modal
      visible={showArtistModal}
      transparent
      animationType="slide"
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={styles.modalOverlay}>
        <View style={styles.artistModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Works by {item?.artist}</Text>
            <TouchableOpacity onPress={() => setShowArtistModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={getArtistWorks()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderArtistWorkItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.artistWorksList}
          />
        </View>
      </View>
    </Modal>
  );

  const renderOptionsModal = () => (
    <Modal
      visible={showOptionsModal}
      transparent
      animationType="slide"
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={styles.modalOverlay}>
        <View style={styles.optionsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Options</Text>
            <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Size Options */}
            <View style={styles.optionSection}>
              <Text style={styles.optionTitle}>Size</Text>
              <View style={styles.optionButtons}>
                {sizeOptions.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedOptions.size === size && styles.selectedOptionButton
                    ]}
                    onPress={() => updateOption('size', size)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      selectedOptions.size === size && styles.selectedOptionButtonText
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frame Options */}
            <View style={styles.optionSection}>
              <Text style={styles.optionTitle}>Frame</Text>
              <View style={styles.optionButtons}>
                {frameOptions.map((frame) => (
                  <TouchableOpacity
                    key={frame}
                    style={[
                      styles.optionButton,
                      selectedOptions.frame === frame && styles.selectedOptionButton
                    ]}
                    onPress={() => updateOption('frame', frame)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      selectedOptions.frame === frame && styles.selectedOptionButtonText
                    ]}>
                      {frame}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantity */}
            <View style={styles.optionSection}>
              <Text style={styles.optionTitle}>Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(-1)}
                >
                  <Ionicons name="remove" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{selectedOptions.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(1)}
                >
                  <Ionicons name="add" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmAddToCart}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderNoWorksModal = () => (
    <Modal
      visible={showNoWorksModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowNoWorksModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.noWorksModal}>
          <Text style={styles.noWorksTitle}>No other works</Text>
          <Text style={styles.noWorksMessage}>
            No other works available by {item?.artist}
          </Text>
          <TouchableOpacity 
            style={styles.okButton}
            onPress={() => setShowNoWorksModal(false)}
          >
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Dữ liệu 3 sản phẩm được gán cứng cho popup
  const featuredArtistWorks = [
    {
      id: 'featured-1',
      title: 'Abstract Harmony',
      artist: item?.artist || 'Emma Rodriguez',
      price: 245000,
      image: 'https://picsum.photos/300/400?random=10',
      tag: 'New',
      tagColor: '#FF6B6B'
    },
    {
      id: 'featured-2', 
      title: 'Urban Symphony',
      artist: item?.artist || 'Emma Rodriguez',
      price: 189000,
      image: 'https://picsum.photos/300/400?random=11',
      tag: 'Popular',
      tagColor: '#4ECDC4'
    },
    {
      id: 'featured-3',
      title: 'Modern Elegance',
      artist: item?.artist || 'Emma Rodriguez', 
      price: 320000,
      image: 'https://picsum.photos/300/400?random=12',
      tag: 'Limited',
      tagColor: '#FFD93D'
    }
  ];

  const renderArtistPopup = () => (
    <Modal
      visible={showArtistPopup}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowArtistPopup(false)}
    >
      <View style={styles.popupOverlay}>
        <View style={styles.artistPopup}>
          <View style={styles.popupHeader}>
            <Text style={styles.popupTitle}>Works by {item?.artist}</Text>
            <TouchableOpacity 
              style={styles.popupCloseButton}
              onPress={() => setShowArtistPopup(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.popupContent}>
            {featuredArtistWorks.map((artwork, index) => (
              <TouchableOpacity 
                key={artwork.id}
                style={styles.popupArtworkItem}
                                 onPress={() => {
                   setShowArtistPopup(false);
                   // Tạo một item giả để navigate đến ProductDetail
                   const fakeItem = {
                     ...artwork,
                     image: artwork.image, // Đảm bảo có thuộc tính image
                     images: [{ uri: artwork.image }], // Thêm mảng images cho carousel với format đúng
                     description: 'A beautiful artwork showcasing the artist\'s unique style and creative vision.',
                     type: 'Oil Painting',
                     style: 'Modern'
                   };
               
                   navigation.navigate('ProductDetail', { item: fakeItem });
                 }}
              >
                <Image 
                  source={{ uri: artwork.image }} 
                  style={styles.popupArtworkImage}
                  resizeMode="cover"
                />
                <View style={styles.popupArtworkInfo}>
                  <Text style={styles.popupArtworkTitle}>{artwork.title}</Text>
                  <Text style={styles.popupArtworkPrice}>{formatCurrency(artwork.price)}</Text>
                  <View style={[styles.popupArtworkTag, { backgroundColor: artwork.tagColor }]}>
                    <Text style={styles.popupArtworkTagText}>{artwork.tag}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.popupOverlay}>
        <View style={styles.successPopup}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Success!</Text>
          <Text style={styles.successProductName}>{item?.name || item?.title}</Text>
          <Text style={styles.successOptions}>
            {selectedOptions.size}, {selectedOptions.frame}
          </Text>
          <Text style={styles.successMessage}>
            Product has been added to your cart successfully
          </Text>
          <View style={styles.successButtons}>
            <TouchableOpacity 
              style={styles.viewCartButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Cart');
              }}
            >
              <Text style={styles.viewCartButtonText}>View Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.continueButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <SafeAreaView style={styles.container} >
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View> */}

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {renderImageCarousel()}
          {renderProductInfo()}
          {renderDescription()}
          {renderSpecifications()}
        </ScrollView>
     
        {renderActionButtons()}
      </SafeAreaView>
             {renderOptionsModal()}
       {renderArtistModal()}
       {renderNoWorksModal()}
       {renderArtistPopup()}
       {renderSuccessModal()}
    </>
  );
} 