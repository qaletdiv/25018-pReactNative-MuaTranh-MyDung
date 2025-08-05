
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default StyleSheet.create({
  listContainer: {
    padding: 16,
    marginBottom: 150, 
  },
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1f1f1f',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  priceTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#000000aa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  newTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#facc15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    color: COLORS.primary,
    fontSize: 14,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
