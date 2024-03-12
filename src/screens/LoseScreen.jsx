import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const LoseScreen = () => {
  return (
    <View style={{flex: 1}}>
      <Image
        source={require('../asset/lose.jpg')}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default LoseScreen;

const styles = StyleSheet.create({});
