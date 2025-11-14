import { StyleSheet } from 'react-native';
import { colors, fonts } from './index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 16,
    //paddingTop: 32,
    paddingBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 35,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  profileText: {
    flex: 1,
    marginLeft: 20,
    paddingHorizontal: 5,  
    marginTop: 0,
  },
  profileName: {
    fontSize: fonts.sizes.h2,
    fontWeight: fonts.weights.bold,
    color: '#fff',
  },
  profileEmail: {
    fontSize: fonts.sizes.body,
    color: '#fff',
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: fonts.sizes.body,
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: fonts.sizes.small,
    color: colors.textLight,
    marginTop: 4,
  },
  sectionHeader: {
    marginLeft: 16,
    marginBottom: 8,
    fontSize: fonts.sizes.h2,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileImage: {
  width: 100,
  height: 125,
  borderRadius: 50,
  backgroundColor: '#fff',
},
  profileImageLarge: {
  width: 96,
  height: 96,
  borderRadius: 48,
  backgroundColor: '#fff',
},
profileDate: {
  color: '#ccc',
  fontSize: 13,
  marginTop: 2,
},

profileType: {
  color: '#ccc',
  fontSize: 13,
  marginTop: 2,
},


});
