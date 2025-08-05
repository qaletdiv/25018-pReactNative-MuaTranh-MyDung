import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.6);
const COMPACT_CARD_WIDTH = Math.round((width - 48) / 2); 
export default StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    marginBottom: 16,
    marginRight: 16,
  },
  compactContainer: {
    width: COMPACT_CARD_WIDTH,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  compactImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  compactInfo: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  compactTitle: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  artist: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 6,
  },
  compactArtist: {
    fontSize: 9,
    color: COLORS.primary,
    marginBottom: 3,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  compactPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: -190,
    left: 10,
  },
  compactTagContainer: {
    top: -90,
    left: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  compactTag: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  compactTagText: {
    fontSize: 7,
    fontWeight: '600',
    color: '#fff',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  compactFavoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 4,
    right: 4,
  },
  filledHeart: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  outlineHeart: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
