import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface Props {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (dateString: string) => void;
  style?: ViewStyle; 
}

export default function InputDate({ icon, placeholder, value, onChange, style }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const formattedForState = selectedDate.toISOString().split('T')[0]; 
      onChange(formattedForState);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const displayText = value ? formatDateForDisplay(value) : placeholder;

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon as any} size={20} style={styles.icon} />
      <TouchableOpacity style={styles.touchable} onPress={() => setShowPicker(true)}>
        <Text style={[styles.text, !value && styles.placeholder]}>
          {displayText}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value ? new Date(`${value}T00:00:00`) : new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()} 
        />
      )}
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
    alignItems: 'center',
    marginBottom: 12,
    // width: 355, // REMOVA ESTA LINHA
    height: 65,
  },
  icon: {
    marginRight: 11, 
    marginLeft: 8,
    color: '#2626268F',
  },
  touchable: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#aaa',
  },
});