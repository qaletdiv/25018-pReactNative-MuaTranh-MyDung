import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fafafa',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: '#2c3e50',
    fontFamily: FONTS.semibold,
    fontSize: 15,
    marginBottom: 3,
    fontWeight: '600',
  },
  country: {
    color: '#7f8c8d',
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginBottom: 2,
  },
  specialty: {
    color: COLORS.primary,
    fontSize: 10,
    fontFamily: FONTS.medium,
    fontWeight: '500',
  },
});
