import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './HomeScreen.styles';

import SearchBar from '../../components/SearchBar/SearchBar';
import Category from '../../components/Category/Category';
import ArtCard from '../../components/ArtCard/ArtCard';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import CategoryList from '../../components/CategoryList/CategoryList';
import { catalogData } from '../../data/catalogData';
import artworksData from '../../data/artworksData';

export default function HomeScreen() {
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

      <SearchBar />
      <Category />

      <Text style={styles.sectionTitle}>New Arts</Text>
      <FlatList
        data={[...artworksData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ArtCard item={item} onPress={() => {}} horizontalCard />
        )}
      />

      <Text style={styles.sectionTitle}>Artists</Text>
      <FlatList
        data={[1, 2]}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ArtistCard
            name="Jessica Math"
            country="Italy · 3 paintings"
            avatar="https://i.pravatar.cc/150?img=5"
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
    </SafeAreaView>
  );
}
