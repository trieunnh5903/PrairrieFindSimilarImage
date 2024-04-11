import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import React from 'react';

interface AppTextInputProps extends TextInputProps {}
const AppTextInput = ({
  placeholderTextColor = 'rgba(255,255,255,0.5)',
  ...props
}: AppTextInputProps) => {
  return (
    <TextInput
      cursorColor={'#fff'}
      // selectionColor={'#fff'}
      placeholderTextColor={placeholderTextColor}
      style={styles.input}
      {...props}
    />
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 16,
  },
});
