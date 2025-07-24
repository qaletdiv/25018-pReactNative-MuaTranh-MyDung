import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';

const CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.6);

export default StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
    marginRight: 16,
    borderColor:COLORS.primary,
    borderWidth:1,
    marginBottom:16,
  },
 
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  artist: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position:'absolute',
    top: -190,
    left:10,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
});
