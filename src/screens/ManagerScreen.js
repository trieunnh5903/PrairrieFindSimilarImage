import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {colors, globalStyle, storageKey} from '../constant';
import {ScreenName} from '../constant/ScreenName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX, {utils} from 'xlsx';
import * as ScopedStorage from 'react-native-scoped-storage';
import Mailer from 'react-native-mail';
import {getDateNow, getTimeNow} from '../utils';

const ManagerScreen = ({navigation}) => {
  const generateDataXlsx = async () => {
    const customerList = await loadCustomerList();
    if (customerList.length === 0) {
      return null;
    }
    const ws = utils.json_to_sheet(customerList);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'SheetJS');
    return wb;
  };

  const requestStoragePermission = async () => {
    try {
      const storagePermission =
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const granted = await PermissionsAndroid.request(storagePermission, {
        title: 'Storage Permission',
        message: 'This app needs access to your storage to save data.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Storage permission denied');
      }
      return false;
    } catch (err) {
      console.log(err);
    }
  };

  const onHistoryPress = async () => {
    try {
      const request = await requestStoragePermission();
      if (!request) {
        return;
      }
      const workbook = await generateDataXlsx();
      if (workbook === null) {
        Alert.alert('Thông báo', 'Dữ liệu trống');
        return;
      }
      const b64 = XLSX.write(workbook, {type: 'base64', bookType: 'xlsx'});
      const file = await ScopedStorage.createDocument(
        `prairie_similar_image_customer_history_${getDateNow()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        b64,
        'base64',
      );
      sendMail(file);
    } catch (error) {
      console.log('writeFile', error);
    }
  };

  const sendMail = file => {
    if (!file) {
      return;
    }
    let sendEmailError = false;
    Mailer.mail(
      {
        subject: `Prairie - Báo cáo lịch sử chơi game xếp hình ${getTimeNow()}`,
        recipients: ['nguyennhathaitrieu5903@gmail.com'],
        body: 'Báo cáo lịch sử chơi game xếp hình',
        customChooserTitle: 'Báo cáo lịch sử chơi game xếp hình',
        isHTML: false,
        attachments: [
          {
            uri: file.uri,
            type: file.mime,
          },
        ],
      },
      (error, event) => {
        Alert.alert('Lỗi', 'Gửi email gặp lỗi');
        sendEmailError = true;
      },
    );
    if (sendEmailError === false) {
      clearHistory(file.uri);
    }
  };

  const clearHistory = async uriFile => {
    try {
      await AsyncStorage.removeItem(storageKey.customerList);
      if (uriFile) {
        await ScopedStorage.deleteFile(uriFile);
      }
    } catch (error) {
      console.log('clearHistory error', error);
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
        <Text style={[globalStyle.textButton]}>Xuất lịch sử chơi game</Text>
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
