import { StyleSheet } from 'react-native';
import { colors, fonts } from './index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  mainTitle: {
    fontSize: fonts.sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  certificado: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#198754',
    marginVertical: 5,
  },
  campaign: {
    fontSize: 18,
    fontStyle: 'italic',
    marginVertical: 5,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 24,
  },
  horasTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  horasValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 8,
  },
  horasSubtext: {
    fontSize: 12,
    color: colors.textLight,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 30,
    opacity: 0.6,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});