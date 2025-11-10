import { StyleSheet } from 'react-native';
import { colors, fonts } from './index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  titulo: {
    fontSize: fonts.sizes.h2,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, // Espaço entre os inputs de data
  },
  dateInput: {
    flex: 1, // Faz os inputs de data dividirem o espaço
    marginBottom: 0,
    width: 'auto', // Permite que o flex: 1 funcione
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  itemInfo: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 8,
  },
  certificateButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 30,
    marginLeft: 10,
  },
});