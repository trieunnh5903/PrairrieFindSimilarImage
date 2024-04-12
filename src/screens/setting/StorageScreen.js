import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyle, storageKey} from '../../constant';
import {AppButton} from '../../components';
import * as ScopedStorage from 'react-native-scoped-storage';
import {storage} from '../../utils';
import RNFS from 'react-native-fs';

const StorageScreen = () => {
  const [uri, setUri] = useState();
  useEffect(() => {
    const getUri = async () => {
      try {
        const persistedUris = await ScopedStorage.getPersistedUriPermissions();
        if (persistedUris.length === 0) {
          setUri('Trống');
        } else {
          const persistedDir = await storage.getObject(
            storageKey.userDataDirectory,
          );
          setUri(persistedDir.uri);
        }
      } catch (error) {}
    };
    getUri();
    return () => {};
  }, []);

  const requestStoragePermission = async () => {
    try {
      const dir = await ScopedStorage.openDocumentTree(true);
      if (!dir) {
        return;
      } // User cancelled
      const listFile = await ScopedStorage.listFiles(dir.uri);
      const existedDir = listFile.find(i => i.name === 'Prairie Puzzle');
      if (existedDir) {
        console.log(existedDir.uri);
      } else {
        const prairieDir = await ScopedStorage.createDirectory(
          dir.uri,
          'Prairie Puzzle',
        );
        console.log(prairieDir.uri);
        storage.setObjData(storageKey.userDataDirectory, prairieDir);
      }
    } catch (err) {
      console.log('requestStoragePermission', err);
    }
  };

  const onOpenDirPress = async () => {
    try {
      const persistedDir = await storage.getObject(
        storageKey.userDataDirectory,
      );
      if (Linking.canOpenURL(persistedDir.uri)) {
        Linking.openURL(persistedDir.uri);
      }
    } catch (error) {
      console.log('onOpenDirPress', error);
    }
  };

  return (
    <View style={[globalStyle.container, globalStyle.gap_16]}>
      <AppButton
        onPress={requestStoragePermission}
        label="Thay đổi nơi lưu trữ"
      />
      <AppButton onPress={onOpenDirPress} label="Mở thư mục lưu trữ" />
    </View>
  );
};

export default StorageScreen;

const styles = StyleSheet.create({});
