import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
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
  chip: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  chipText: {
    color: '#555',
    fontSize: 14,
  },
  chipRemove: {
    marginLeft: 6,
  },
  chipRemoveText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
});
