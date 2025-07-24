import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    width:230,
    borderRadius: 12,
    paddingHorizontal:12,
    paddingVertical:15,
    marginRight: 12,
    borderWidth:2,
    borderColor:COLORS.white,
    backgroundColor:COLORS.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
    borderWidth:1,
    borderColor:COLORS.dark,
    marginRight:20,
    elevation:6,
  },
  name: {
   color: COLORS.dark,
   fontFamily: FONTS.semibold,
  },
  country: {
    color: '#333',
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
});
