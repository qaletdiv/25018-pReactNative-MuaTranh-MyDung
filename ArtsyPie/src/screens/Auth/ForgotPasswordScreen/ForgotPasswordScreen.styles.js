import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { FONTS } from '../../../theme/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.mutedText,
    marginBottom: 30,
    lineHeight:25,
  },
  label: {
    fontSize: 15,
    fontFamily: FONTS.semibold,
    color: '#333',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    color: '#000',
  },
  inputValid: {
    borderColor: '#4CAF50',
  },
  inputInvalid: {
    borderColor: '#f44336',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});
