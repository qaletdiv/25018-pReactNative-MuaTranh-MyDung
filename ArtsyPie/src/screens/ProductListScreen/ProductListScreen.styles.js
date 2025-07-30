import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  productCount: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  flatListWrapper: {
    paddingHorizontal: 20, 
  },
  row: {
    justifyContent: 'space-between', 
    marginBottom: 12, 
  },
  productList: {
    marginTop: 10,
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
    marginLeft: 16,
  },
});
