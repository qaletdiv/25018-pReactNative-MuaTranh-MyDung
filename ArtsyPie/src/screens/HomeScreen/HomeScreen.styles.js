import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 40, 
  },
  titleBold: {
    color: COLORS.primary,
    fontSize: 28,
    fontFamily:FONTS.bold,
    letterSpacing: 3,
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: FONTS.medium,
  },
  sectionLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  sectionLoadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: FONTS.medium,
  },
  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ff6b6b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    fontFamily: FONTS.regular,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  artistsContainer: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: FONTS.medium,
  },
  categoryList:{
    marginBottom: 20,
    paddingBottom: 50, // Tăng padding bottom cho catalog section
  }
});
