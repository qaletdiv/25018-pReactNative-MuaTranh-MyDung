import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    fontFamily: FONTS.medium,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontFamily:FONTS.semibold,
    marginBottom: 4,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    paddingVertical: 12,
    padding: 4,
    borderRadius: 8,
    fontSize: 14,
    paddingRight: 40,
    color: '#000',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#333',
    fontSize: 13,
    marginTop:10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop:30,
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
    marginVertical: 20,
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
  },
  socialButtonWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  socialTextBlack: {
    fontFamily: FONTS.bold,
    color: '#333',
    fontSize: 14,
  },
  socialButtonBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 15,
  },
  socialTextWhite: {
    fontFamily: FONTS.bold,
    color: '#fff',
    fontSize: 14,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  bottomText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginTop: 30,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontFamily: FONTS.bold,
  },
});
