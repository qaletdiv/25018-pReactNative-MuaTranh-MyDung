
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
  tagContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 5,
    minWidth: 40,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
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
