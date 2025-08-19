// CardList.js
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './CategoryList.styles';

const CardList = ({ data }) => {
  const navigation = useNavigation();

  //console.log('CategoryList received data:', data);
  //console.log('Navigation object:', navigation); 

  // Kiểm tra navigation có hoạt động không
  if (!navigation) {
    //console.error('Navigation is not available in CategoryList');
    return null;
  }

  const getImageSource = (src) => {
    if (!src) return null;
    
    // Nếu là require() object (local image)
    if (typeof src === 'number') {
      return src;
    }
    
    // Nếu là string URL
    if (typeof src === 'string') {
      return { uri: src };
    }
    
    // Fallback
    return src;
  };

  // Hàm xử lý khi click vào tag
  const handleTagPress = (tag) => {
    //console.log('Tag clicked:', tag);
    
    try {
      let searchTitle = '';
      let searchType = '';
      
      switch (tag) {
        case 'New':
          searchTitle = 'New Products';
          searchType = 'new';
          break;
        case 'Hot':
          searchTitle = 'Hot Products';
          searchType = 'hot';
          break;
        case 'Trending':
          searchTitle = 'Trending Products';
          searchType = 'trending';
          break;
        default:
          console.error('Unknown tag:', tag);
          return;
      }
      
      //console.log('Navigating to SearchScreen with:', { searchTitle, searchType, tagFilter: tag });
      
      if (navigation && navigation.navigate) {
        navigation.navigate('SearchScreen', { 
          searchTitle,
          searchType,
          tagFilter: tag
        });
        //console.log('Navigation successful');
      } else {
        console.error(' Navigation object is invalid:', navigation);
      }
    } catch (error) {
      console.error('Error in handleTagPress:', error);
    }
  };

  // Hàm để xác định tag cho từng item
  const getItemTag = (item, index) => {
    //console.log('Getting tag for item:', { id: item.id, title: item.title, index, isNew: item.isNew });
    
    let tag = null;
    // Đảm bảo mỗi item có tag khác nhau dựa trên index
    if (index === 0) {
      tag = { tag: 'New', color: '#FFD700' };
    } else if (index === 1) {
      tag = { tag: 'Hot', color: '#FF6B6B' };
    } else if (index === 2) {
      tag = { tag: 'Trending', color: '#4ECDC4' };
    }
    
    //console.log('Tag result:', tag);
    return tag;
  };

  const renderItem = ({ item, index }) => {
    const itemTag = getItemTag(item, index);
    
    return (
      <TouchableOpacity 
        style={styles.cardContainer} 
        activeOpacity={0.8}
        onPress={() => {
          //console.log('Entire card clicked for:', itemTag ? itemTag.tag : 'No tag');
          if (itemTag) {
            handleTagPress(itemTag.tag);
          }
        }}
      >
        <View style={{ width: '100%', height: 200, backgroundColor: '#333' }}>
          <Image 
            source={getImageSource(item.image)}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              // Silent error handling
            }}
            onLoad={() => {
              // Silent success handling
            }}
          />
        </View>

        {item.price && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${item.price}</Text>
          </View>
        )}

        {itemTag && (
          <View style={[styles.tagContainer, { backgroundColor: itemTag.color }]}>
            <Text style={styles.tagText}>{itemTag.tag}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.authorContainer}>
            <Text style={styles.author}>{item.author}</Text>
            {item.avatar && (
              <Image
                source={getImageSource(item.avatar)}
                style={styles.avatar}
                resizeMode="cover"
                onError={(error) => {
                  // Silent error handling
                }}
                onLoad={() => {
                  // Silent success handling
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!data || data.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>No catalog data</Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 10,
            marginTop: 10,
            borderRadius: 5,
          }}
          onPress={() => {
            if (navigation && navigation.navigate) {
              navigation.navigate('SearchScreen', { 
                searchTitle: 'Test Products',
                tagFilter: 'Test'
              });
            }
          }}
        >
          <Text style={{ color: 'white' }}>Test Navigation</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //console.log('Catalog data available, length:', data.length); 

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CardList;
