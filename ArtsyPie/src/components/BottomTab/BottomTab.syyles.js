import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import styles from './HomeScreen.styles';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryList from '../../components/CategoryList/CategoryList';
import NewArtSection from '../../components/ArtCard/ArtCard';
import ArtistSection from '../../components/ArtistCard/ArtistCard';
import BottomTab from '../../components/BottomTab/BottomTab';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.title}>Art catalog</Text>

        {/* Search */}
        <SearchBar />

        {/* Categories */}
        <CategoryList />

        {/* New Arts */}
        <NewArtSection />

        {/* Artists */}
        <ArtistSection />
      </ScrollView>

      {/* Bottom Tab */}
      <BottomTab />
    </View>
  );
}
