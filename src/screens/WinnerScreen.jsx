import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';

const WinnerScreen = ({route, navigation}) => {
  const uri = route.params.uri;
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);
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
