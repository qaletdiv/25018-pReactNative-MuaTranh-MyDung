import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
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
    fontFamily:FONTS.bold,
    marginTop: 20,
    marginBottom: 10,
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
});
