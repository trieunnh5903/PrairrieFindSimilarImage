import {
  ColorValue,
  DimensionValue,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';

interface PaddingProps {
  backgroundColor?: ColorValue | undefined;
  padding?: DimensionValue | undefined;
}
const Padding = ({
  backgroundColor = 'rgba(0,0,0,0.1)',
  padding = 8,
}: PaddingProps) => {
  return (
    <View
      style={{width: '100%', backgroundColor, padding, marginVertical: 16}}
    />
  );
};

export default Padding;

const styles = StyleSheet.create({});
