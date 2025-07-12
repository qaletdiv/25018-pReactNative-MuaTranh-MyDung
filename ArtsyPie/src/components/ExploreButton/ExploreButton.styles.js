// src/components/ExploreButton/ExploreButton.styles.js
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';

export default StyleSheet.create({
  button: {
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    height:70,
    justifyContent:'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color:COLORS.white,
    marginRight: 8,
    fontFamily:FONTS.medium,
  },
  icon: {
    marginTop: 1,
    position: 'absolute',
    right: -70,
  },
});
