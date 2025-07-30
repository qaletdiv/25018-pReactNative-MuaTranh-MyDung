import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  clearText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 2,
    alignItems: 'center',
    maxWidth: '32%',
  },
  chipText: {
    color: '#555',
    fontSize: 12,
    flex: 1,
  },
  chipRemove: {
    marginLeft: 4,
  },
  chipRemoveText: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
});
