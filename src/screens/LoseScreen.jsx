import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storageKey} from '../constant';
import {getTimeNow} from '../utils';

const LoseScreen = ({navigation}) => {
  const foodStore = useSelector(state => state.loseImage);

  useEffect(() => {
    const saveCustomerInformation = async () => {
      try {
        const storedCustomerListJSON = await AsyncStorage.getItem(
          storageKey.customerList,
        );
        const storedCustomerList = JSON.parse(storedCustomerListJSON);

        const lastCustomer = storedCustomerList[storedCustomerList.length - 1];
        const updatedCustomer = {
          ...lastCustomer,
          ['Ket qua']: 'Chúc bạn may mắn lần sau',
          ['Thoi gian choi']: getTimeNow(),
        };

        const updatedCustomerList = [
          ...storedCustomerList.slice(0, storedCustomerList.length - 1),
          updatedCustomer,
        ];
        await AsyncStorage.setItem(
          storageKey.customerList,
          JSON.stringify(updatedCustomerList),
        );
      } catch (error) {
        console.log(error);
      }
    };
    saveCustomerInformation();
  }, []);

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
