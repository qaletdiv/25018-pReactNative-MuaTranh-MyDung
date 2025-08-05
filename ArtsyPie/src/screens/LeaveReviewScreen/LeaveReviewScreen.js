import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import styles from './LeaveReviewScreen.styles';
import { COLORS } from '../../theme/colors';

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

export default function LeaveReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { product, order } = route.params;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      Alert.alert('Error', 'Please write a review with at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Thank you for your review!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProductInfo = () => (
    <View style={styles.productContainer}>
      <Image 
        source={getImageSource(product.image)}
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productOptions}>{product.options || product.size}</Text>
        <Text style={styles.orderInfo}>Order: {order.id || order.orderNumber}</Text>
      </View>
    </View>
  );

  const renderRatingSection = () => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>Rate this product</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => handleRatingPress(star)}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color={star <= rating ? "#FFD700" : "#ccc"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>
        {rating === 0 && "Tap to rate"}
        {rating === 1 && "Poor"}
        {rating === 2 && "Fair"}
        {rating === 3 && "Good"}
        {rating === 4 && "Very Good"}
        {rating === 5 && "Excellent"}
      </Text>
    </View>
  );

  const renderReviewSection = () => (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewTitle}>Write your review</Text>
      <TextInput
        style={styles.reviewInput}
        placeholder="Share your experience with this product..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={styles.characterCount}>
        {reviewText.length}/500 characters
      </Text>
    </View>
  );

  const renderTips = () => (
    <View style={styles.tipsContainer}>
      <Text style={styles.tipsTitle}>Review Tips</Text>
      <View style={styles.tipItem}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
        <Text style={styles.tipText}>Share what you liked about the product</Text>
      </View>
      <View style={styles.tipItem}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
        <Text style={styles.tipText}>Mention the quality and condition</Text>
      </View>
      <View style={styles.tipItem}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
        <Text style={styles.tipText}>Describe how it looks in your space</Text>
      </View>
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
        <Text style={styles.headerTitle}>Leave Review</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProductInfo()}
        {renderRatingSection()}
        {renderReviewSection()}
        {renderTips()}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || reviewText.trim().length < 10) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitReview}
          disabled={rating === 0 || reviewText.trim().length < 10 || isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 