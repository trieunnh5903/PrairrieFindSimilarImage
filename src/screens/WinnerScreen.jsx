import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const WinnerScreen = ({route}) => {
  const uri = route.params.uri;
  return (
    <View style={{flex: 1}}>
      <Image
        resizeMode="cover"
        source={{uri: uri}}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default WinnerScreen;

const styles = StyleSheet.create({});
