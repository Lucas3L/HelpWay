import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles'; 

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean; 
};

export default function Button({ title, onPress, variant = 'primary', disabled = false }: Props) { // 2. Receber a prop
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled, 
      ]}
      onPress={onPress}
      disabled={disabled} 
      >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#fff',
  },
  
  
  disabled: {
    backgroundColor: '#ccc', 
    opacity: 0.7,
  },
});