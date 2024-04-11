import {
  ColorValue,
  DimensionValue,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';

interface PaddingProps {
  backgroundColor?: ColorValue | undefined;
  padding?: DimensionValue | undefined;
  marginVertical?: DimensionValue | undefined;
}
const Padding = ({
  backgroundColor = 'rgba(0,0,0,0.1)',
  padding = 8,
  marginVertical = 16,
}: PaddingProps) => {
  return (
    <View
      style={{
        width: Dimensions.get('window').width,
        backgroundColor,
        padding,
        marginVertical,
      }}
    />
  );
};

export default Padding;

const styles = StyleSheet.create({});
