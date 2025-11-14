import { StyleSheet } from 'react-native';
import { colors, fonts } from './index';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fonts.sizes.h1,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  forgot: {
    color: colors.textLight,
    marginBottom: 20,
    marginTop: -10,
    textAlign: 'right',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
     color: 'red',
  marginBottom: 8,
  marginLeft: 10,
  fontSize: 14,
  },
  or: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#999',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
   register: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '85%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: fonts.sizes.h2 || 20,
    fontWeight: fonts.weights.bold,
    marginBottom: 16,
    color: colors.primary,
    textAlign: 'center',
  },
  biometricButton: {
    flexDirection: 'row',
    backgroundColor: '#343a40', // Cor escura para diferenciar
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  biometricText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
