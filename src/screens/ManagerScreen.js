import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors, globalStyle, storageKey} from '../constant';
import {ScreenName} from '../constant/ScreenName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX, {utils} from 'xlsx';
import * as ScopedStorage from 'react-native-scoped-storage';

const ManagerScreen = ({navigation}) => {
  const generateDataXlsx = async () => {
    const customerList = await loadCustomerList();
    // console.log(customerList);
    const ws = utils.json_to_sheet(customerList);

    /* build new workbook */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'SheetJS');

    return wb;
  };

  const onHistoryPress = async () => {
    try {
      const workbook = await generateDataXlsx();
      const b64 = XLSX.write(workbook, {type: 'base64', bookType: 'xlsx'});
      const file = await ScopedStorage.createDocument(
        'Prairie Similar Image Customer History.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        b64,
        'base64',
      );
      console.log('writeFile', file);
    } catch (error) {
      console.log('writeFile', error);
    }
  };

  const loadCustomerList = async () => {
    try {
      const storedCustomerList = await AsyncStorage.getItem(
        storageKey.customerList,
      );
      if (storedCustomerList !== null) {
        return JSON.parse(storedCustomerList);
      }
      return [];
    } catch (error) {
      console.error('Error loading customer list:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(ScreenName.ImageSettingScreen)}
        style={globalStyle.button}>
        <Text style={[globalStyle.textButton]}>Hình ảnh trò chơi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(ScreenName.TimeSettingScreen)}
        style={globalStyle.button}>
        <Text style={[globalStyle.textButton]}>Thời gian chơi game</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onHistoryPress} style={globalStyle.button}>
        <Text style={[globalStyle.textButton]}>Lịch sử chơi game</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManagerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    gap: 20,
  },
});
