import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import styles from './Category.styles';

const categories = [
  {
    name: 'Cubism',
    image: require('../../../assets/Images/Category/flower.png'),
  },
  {
    name: 'Art Deco',
    image: require('../../../assets/Images/Category/picall.png'),
  },
  {
    name: 'Avant-garde',
    image: require('../../../assets/Images/Category/wreath.png'),
  },
  {
    name: 'Classicism',
    image: require('../../../assets/Images/Category/flowerbou.png'),
  },
  {
    name: 'Modern',
    image: require('../../../assets/Images/Category/gift.png'),
  },
  {
    name: 'Artical',
    image: require('../../../assets/Images/Category/paint.png'),
  },
  {
    name: 'Retro',
    image: require('../../../assets/Images/Category/picture.png'),
  },
];

export default function Category() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((item, index) => (
        <View key={index}>
          <View style={styles.item}>
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={styles.icon}
            />
          </View>
          <View>
            <Text style={styles.label}>{item.name}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
