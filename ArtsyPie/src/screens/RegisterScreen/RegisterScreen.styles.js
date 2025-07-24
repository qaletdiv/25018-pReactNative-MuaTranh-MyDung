import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    marginBottom: 6,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    marginBottom: 25,
    fontFamily: FONTS.medium,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
    marginBottom: 4,
    color: '#333',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 40,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
  },
  iconWrapper: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  inputValid: {
    borderColor: '#4CAF50',
  },
  inputInvalid: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    color: '#333',
    fontSize: 13,
  },
  termsLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontFamily: FONTS.bold,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
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
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  socialButtonWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  socialButtonBlue: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1877F2',
    marginBottom: 15,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 12,
  },
  socialTextBlack: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  socialTextWhite: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  link: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
});
