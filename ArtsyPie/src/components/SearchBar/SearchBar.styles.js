import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  compactWrapper: {
    marginVertical: 10,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 45,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  compactContainer: {
    height: 40,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    color: '#000',
    marginHorizontal: 8,
  },
  compactInput: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  iconLeft: {
    marginRight: 4,
    color: COLORS.primary,
  },
  iconRight: {
    marginLeft: 4,
    color: COLORS.primary,
  },
  cameraButton: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
