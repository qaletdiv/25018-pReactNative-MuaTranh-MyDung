import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  image: {
    width: '100%',
    height: height * 0.5,
    borderRadius: 60,
    resizeMode: 'cover',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 5, 
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  bottomContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  loginText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.mutedText,
  },
  loginLink: {
    fontWeight: 'bold',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
