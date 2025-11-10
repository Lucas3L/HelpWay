import { StyleSheet } from 'react-native';
import { colors, fonts } from './index';

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  titulo: {
    fontSize: fonts.sizes.h1,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    alignSelf: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#888',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginVertical: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: fonts.weights.bold,
  },
  valuesContainer: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center'
  },
  valueText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500'
  }
});