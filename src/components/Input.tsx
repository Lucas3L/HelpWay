import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface Props extends TextInputProps {
  icon: string;
  style?: ViewStyle; 
}

export default function Input({ icon, style, ...rest }: Props) {
  return (
    <View style={[styles.container, style]}>
      <FontAwesome5 name={icon} size={15} color="gray" />
      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        {...rest} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 10,
    height: 65
  },
  icon: {
    marginHorizontal: 15,
    color: '#888',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 12
  },
});