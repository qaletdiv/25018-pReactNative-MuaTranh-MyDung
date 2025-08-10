import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArtworks } from '../../redux/slices/artworksSlice';
import ArtCard from '../../components/ArtCard/ArtCard';
import styles from './ArtistProfileScreen.styles';

const { width } = Dimensions.get('window');

export default function ArtistProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { artworks = [] } = useSelector(state => state.artworks);
  
  // Get artist info from route params
  const { artistName } = route.params || {};
  
  const [artistArtworks, setArtistArtworks] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'paintings', 'prints'

  // Load artworks when component mounts
  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  // Filter artworks by artist
  useEffect(() => {
    if (artworks && artistName) {
      const filteredArtworks = artworks.filter(
        artwork => artwork.artist?.toLowerCase().includes(artistName.toLowerCase())
      );
      setArtistArtworks(filteredArtworks);
    }
  }, [artworks, artistName]);

  // Mock artist data (có thể thay thế bằng API call thực tế)
  const artistInfo = {
    name: artistName || 'Unknown Artist',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Renowned contemporary artist specializing in abstract and modern art. Known for vibrant colors and emotional depth in every piece.',
    location: 'New York, USA',
    yearsActive: '2010 - Present',
    totalWorks: artistArtworks.length,
    exhibitions: 25,
    awards: 8,
    followers: 1234,
    specialty: 'Abstract Art, Modern Paintings'
  };

  const handleArtworkPress = (artwork) => {
    navigation.navigate('ProductDetail', { item: artwork });
  };

  const handleFollow = () => {
    // Implement follow functionality
    console.log('Follow artist:', artistName);
  };

  const handleContact = () => {
    // Implement contact functionality
    console.log('Contact artist:', artistName);
  };

  const renderArtwork = ({ item, index }) => (
    <View style={styles.artworkContainer}>
      <ArtCard 
        item={item}
        onPress={() => handleArtworkPress(item)}
        compact={true}
        showFavorite={true}
      />
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{artistInfo.totalWorks}</Text>
        <Text style={styles.statLabel}>Artworks</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{artistInfo.exhibitions}</Text>
        <Text style={styles.statLabel}>Exhibitions</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{artistInfo.awards}</Text>
        <Text style={styles.statLabel}>Awards</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{artistInfo.followers}</Text>
        <Text style={styles.statLabel}>Followers</Text>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
        onPress={() => setActiveTab('all')}
      >
        <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
          All ({artistArtworks.length})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'paintings' && styles.activeTab]}
        onPress={() => setActiveTab('paintings')}
      >
        <Text style={[styles.tabText, activeTab === 'paintings' && styles.activeTabText]}>
          Paintings
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'prints' && styles.activeTab]}
        onPress={() => setActiveTab('prints')}
      >
        <Text style={[styles.tabText, activeTab === 'prints' && styles.activeTabText]}>
          Prints
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{artistInfo.name}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Artist Info */}
        <View style={styles.artistInfoContainer}>
          <Image source={{ uri: artistInfo.avatar }} style={styles.artistAvatar} />
          <Text style={styles.artistName}>{artistInfo.name}</Text>
          <Text style={styles.artistLocation}>
            <Ionicons name="location-outline" size={16} color="#666" /> {artistInfo.location}
          </Text>
          <Text style={styles.artistSpecialty}>{artistInfo.specialty}</Text>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
              <Ionicons name="mail-outline" size={20} color="#FF6B6B" />
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        {renderStats()}

        {/* Bio */}
        <View style={styles.bioContainer}>
          <Text style={styles.bioTitle}>About the Artist</Text>
          <Text style={styles.bioText}>{artistInfo.bio}</Text>
          <Text style={styles.yearsActive}>Active: {artistInfo.yearsActive}</Text>
        </View>

        {/* Tab Bar */}
        {renderTabBar()}

        {/* Artworks Grid */}
        <View style={styles.artworksSection}>
          {artistArtworks.length > 0 ? (
            <FlatList
              data={artistArtworks}
              renderItem={renderArtwork}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.artworksList}
              columnWrapperStyle={styles.artworkRow}
            />
          ) : (
            <View style={styles.noArtworksContainer}>
              <Ionicons name="image-outline" size={64} color="#ccc" />
              <Text style={styles.noArtworksText}>No artworks found</Text>
              <Text style={styles.noArtworksSubtext}>
                This artist hasn't uploaded any artworks yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
