import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;
const cardHeight = cardWidth * 1.2; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 10,
    height: 300,
  },
  heroImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  topIcons: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  iconBox: {
    backgroundColor: 'rgba(129, 125, 125, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
    height: 5,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 10,
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: cardWidth * 0.9,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  cardTitle: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
});

export default styles;
