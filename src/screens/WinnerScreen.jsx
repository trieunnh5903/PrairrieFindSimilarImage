import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

const WinnerScreen = () => {
  const source = useSelector(state => state.selectedGame);
  return (
    <View style={{flex: 1}}>
      <Image source={{uri: source}} style={{width: '100%', height: '100%'}} />
    </View>
  );
};

export default WinnerScreen;

const styles = StyleSheet.create({});
