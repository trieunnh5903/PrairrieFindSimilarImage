import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors, globalStyle, storageKey} from '../constant';
import {ScreenName} from '../constant/ScreenName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX, {utils} from 'xlsx';
import * as ScopedStorage from 'react-native-scoped-storage';
import Mailer from 'react-native-mail';
import {getDateNow, getTimeNow} from '../utils';
import {AppButton} from '../components';

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
      const persistedUris = await ScopedStorage.getPersistedUriPermissions();
      if (persistedUris.length > 0) {
        return;
      }
      Alert.alert(
        'Quyền truy cập bộ nhớ',
        'Ứng dụng này cần quyền truy cập vào bộ nhớ của bạn để lưu dữ liệu tạm thời',
        [
          {
            text: 'Hủy',
            onPress: () => {
              return;
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              const dir = await ScopedStorage.openDocumentTree(true);
              if (!dir) {
                return;
              } // User cancelled
              await AsyncStorage.setItem(
                storageKey.userDataDirectory,
                JSON.stringify(dir),
              );
              const file = await exportFile();
              sendMail(file);
            },
          },
        ],
      );
    } catch (err) {
      console.log(err);
    }
  };

  const exportFile = async () => {
    try {
      const dirJson = await AsyncStorage.getItem(storageKey.userDataDirectory);
      const dir = dirJson != null ? JSON.parse(dirJson) : null;
      if (!dir) {
        return;
      }
      const workbook = await generateDataXlsx();
      if (workbook === null) {
        Alert.alert('Thông báo', 'Dữ liệu trống');
        return;
      }
      const b64 = XLSX.write(workbook, {type: 'base64', bookType: 'xlsx'});
      const filePatch = await ScopedStorage.writeFile(
        dir.uri,
        b64,
        `prairie_similar_image_customer_history ${getDateNow()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'base64',
      );

      const file = {
        uri: filePatch,
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      const fileUrisJson = await AsyncStorage.getItem(storageKey.fileUris);
      const fileUrisStored = fileUrisJson ? JSON.parse(fileUrisJson) : [];
      await AsyncStorage.setItem(
        storageKey.fileUris,
        JSON.stringify([...fileUrisStored, file.uri]),
      );

      return file;
    } catch (error) {
      console.log('exportFile', error);
    }
  };

  const onHistoryPress = async () => {
    try {
      requestStoragePermission();
      const file = await exportFile();
      await sendMail(file);
    } catch (error) {
      console.log('writeFile', error);
    }
  };

  const sendMail = file => {
    return new Promise((resolve, reject) => {
      if (!file.uri || !file.mime) {
        return resolve(false);
      }
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
          if (error) {
            return reject(error);
          }
          Alert.alert('Lỗi', 'Gửi email gặp lỗi');
        },
      );
      resolve(true);
    });
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(storageKey.customerList);
      const fileUrisJson = await AsyncStorage.getItem(storageKey.fileUris);
      if (fileUrisJson) {
        const fileUris = JSON.parse(fileUrisJson);
        fileUris.forEach(element => {
          ScopedStorage.deleteFile(element);
        });
      }
      await AsyncStorage.removeItem(storageKey.fileUris, error => {
        Alert.alert('Thông báo', 'Xóa thành công');
      });
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

      <AppButton
        label="Điểm bán hiện tại"
        onPress={() => navigation.navigate(ScreenName.LocationScreen)}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate(ScreenName.StorageScreen)}
        style={globalStyle.button}>
        <Text style={[globalStyle.textButton]}>Lưu trữ</Text>
      </TouchableOpacity>
      {/*
      <TouchableOpacity onPress={clearHistory} style={globalStyle.button}>
        <Text style={[globalStyle.textButton, {color: 'red'}]}>
          Xóa lịch sử chơi game
        </Text>
      </TouchableOpacity> */}
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
