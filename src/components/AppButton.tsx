import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {globalStyle} from '../constant';

interface AppButtonProps {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  label: string;
  style?: StyleProp<ViewStyle>;
}
const AppButton = ({onPress, style, label}: AppButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[globalStyle.button, style]}>
      <Text style={[globalStyle.textButton]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;
