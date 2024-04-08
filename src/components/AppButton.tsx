import {GestureResponderEvent, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {globalStyle} from '../constant';

interface AppButtonProps {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  label: string;
}
const AppButton = ({onPress, label}: AppButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={globalStyle.button}>
      <Text style={[globalStyle.textButton]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;
