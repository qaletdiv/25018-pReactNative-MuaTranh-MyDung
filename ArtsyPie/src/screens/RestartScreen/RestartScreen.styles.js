import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/colors';


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  logo: {
     minWidth:200,
    minHeight:200,
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});
