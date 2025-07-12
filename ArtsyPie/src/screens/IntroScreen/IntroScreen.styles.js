import { StyleSheet, Dimensions } from 'react-native';
import { FONTS } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    padding: 35,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily:FONTS.semibold,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 12,
    lineHeight:40,
    letterSpacing:1.2,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'left',
    alignItems:'left',
    marginBottom: 32,
    lineHeight: 22,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: FONTS.regular,
  },
  loginText: {
    color: '#ccc',
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  loginLink: {
    color: '#C1A469',
    fontWeight: FONTS.bold,
  },
  background: {
  flex: 1,
  justifyContent: 'flex-end',
  padding: 24,
},

overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
},

content: {
  zIndex: 10,
},

title: {
  fontSize: 28,
  color: '#fff',
  fontWeight: '600',
  marginBottom: 8,
},

subtitle: {
  fontSize: 14,
  color: '#ccc',
  marginBottom: 40,
},

button: {
  backgroundColor: '#C1A469', 
  paddingVertical: 14,
  borderRadius: 30,
  alignItems: 'center',
},

buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

loginText: {
  marginTop: 16,
  color: '#fff',
  textAlign: 'center',
},

loginLink: {
  color: '#C1A469',
  fontWeight: '500',
},
});
