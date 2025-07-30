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
import { addToCart } from '../../redux/slices/cartSlice';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { item } = route.params || {};
  const token = useSelector(state => state.auth.token);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    size: 'Standard',
    frame: 'No Frame',
    quantity: 1,
  });

  // Auto slider timer
  const sliderRef = useRef(null);

  // Sử dụng mảng images từ dữ liệu sản phẩm, nếu không có thì fallback về image đơn
  const images = item?.images || (item?.image ? [{ uri: item.image }] : []);

  // Đảm bảo images luôn có ít nhất 1 item
  const safeImages = images.length > 0 ? images : [{ uri: 'https://picsum.photos/400/600?random=1' }];

  // Auto slider effect 
  useEffect(() => {
    if (safeImages.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % safeImages.length;
      try {
        sliderRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setCurrentImageIndex(nextIndex);
      } catch (error) {
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

  const handleAddToCart = () => {
    if (!token) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigation.navigate('LoginScreen');
      return;
    }
    setShowOptionsModal(true);
  };

  const handleConfirmAddToCart = () => {
    setShowOptionsModal(false);

    // Thêm vào giỏ hàng với options đã chọn
    dispatch(addToCart({
      productId: item.id,
      quantity: selectedOptions.quantity,
      size: selectedOptions.size,
      frame: selectedOptions.frame
    }));

    Alert.alert(
      'Success',
      `Product has been added to your cart!\n\nOptions:\n- Size: ${selectedOptions.size}\n- Frame: ${selectedOptions.frame}\n- Quantity: ${selectedOptions.quantity}`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => navigation.navigate('MainTabs')
        },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  const handleAddToFavorite = () => {
    if (!token) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigation.navigate('LoginScreen');
      return;
    }
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite ? 'Product has been removed from your favorites' : 'Product has been added to your favorites'
    );
  };

  const handleArtistPress = () => {
    Alert.alert('Artist', `View all works by ${item?.artist}`);
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
          setCurrentImageIndex(index);
        }}
        renderItem={({ item: imageItem, index }) => (
          <Image
            key={`image-${index}`}
            source={typeof imageItem === 'string' ? { uri: imageItem } : imageItem}
            style={styles.productImage}
            resizeMode="cover"
          />
        )}
      />

      {/* Image indicators - chỉ hiển thị khi có nhiều hơn 1 ảnh */}
      {safeImages.length > 1 && (
        <View style={styles.imageIndicators}>
          {safeImages.map((_, index) => (
            <View
              key={`indicator-${index}`}
              style={[
                styles.indicator,
                index === currentImageIndex && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <Text style={styles.productTitle}>{item?.title || 'Product Name'}</Text>
      <TouchableOpacity onPress={handleArtistPress}>
        <Text style={styles.artistName}>By {item?.artist || 'Artist'}</Text>
      </TouchableOpacity>
      <Text style={styles.price}>{formatCurrency(item?.price || 0)}</Text>
    </View>
  );

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
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
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
    </>
  );
} 