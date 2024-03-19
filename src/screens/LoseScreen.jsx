import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

const LoseScreen = () => {
  const foodStore = useSelector(state => state.loseImage);

  return (
    <View style={{flex: 1}}>
      <Image
        resizeMode="contain"
        source={{uri: foodStore}}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default LoseScreen;

const styles = StyleSheet.create({});
