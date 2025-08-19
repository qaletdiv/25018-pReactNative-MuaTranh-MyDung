import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';

const { width: screenWidth } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 0, 
  },
  bannerList: {
    paddingHorizontal: 0, 
  },
  bannerItem: {
    width: screenWidth - 40, // Full width minus padding
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bannerContent: {
    padding: 20,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 28,
  },
  bannerDescription: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
    lineHeight: 18,
    opacity: 0.9,
  },
  bannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  bannerButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
});
