import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomerKey, storageKey} from '../constant';
import {getTimeNow} from '../utils';

const WinnerScreen = ({route, navigation}) => {
  const item = route.params.item;
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

  useEffect(() => {
    const saveCustomerInformation = async () => {
      try {
        const storedCustomerListJSON = await AsyncStorage.getItem(
          storageKey.customerList,
        );
        const storedCustomerList = JSON.parse(storedCustomerListJSON);

        const lastCustomer = storedCustomerList[storedCustomerList.length - 1];
        // console.log('lastCustomer', lastCustomer);
        const updatedCustomer = {
          ...lastCustomer,
          [CustomerKey.KET_QUA]: item.name,
          [CustomerKey.KET_THUC]: getTimeNow(),
        };
        // console.log('updatedCustomer', updatedCustomer);

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
  }, [item.name]);

  return (
    <View style={{flex: 1}}>
      <Image
        resizeMode="cover"
        source={{uri: item.giftUri}}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default WinnerScreen;

const styles = StyleSheet.create({});
