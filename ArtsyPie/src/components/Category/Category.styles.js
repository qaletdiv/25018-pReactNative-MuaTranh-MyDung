import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';


export default StyleSheet.create({
  container: {
    marginTop: 20,
  },
  item: {
    borderRadius: 12,
    paddingHorizontal:20,
    paddingVertical:15,
    alignItems: 'center',
    marginRight: 12,
    width: 80,
    borderWidth:2,
    borderColor:COLORS.border,
    elevation:6,
    backgroundColor:'#fff',
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  label: {
    color: COLORS.primary,
    fontSize: 12,
    textAlign: 'center',
    marginRight:12,
    paddingTop:10,
    fontFamily:FONTS.medium,
  },
});
