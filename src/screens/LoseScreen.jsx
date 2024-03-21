import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

const LoseScreen = ({navigation}) => {
  const foodStore = useSelector(state => state.loseImage);
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
        source={{uri: foodStore}}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default LoseScreen;

const styles = StyleSheet.create({});
