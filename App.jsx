import {LogBox, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import Application from './src/navigators/Application';
import {storage} from './src/utils';
import {CustomerKey, storageKey} from './src/constant';
import * as ScopedStorage from 'react-native-scoped-storage';

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    const cleanHistory = async () => {
      try {
        // clear data async
        const currentDate = new Date();
        const userHistory =
          (await storage.getObject(storageKey.customerList)) || [];
        const filteredHistory = userHistory.filter(item => {
          const itemDate = new Date(item[CustomerKey.NGAY]);
          return (
            itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear()
          );
        });
        await storage.setObjData(storageKey.customerList, filteredHistory);
        // clear excel
        const dirName = 'Prairie Puzzle';
        const dir = await storage.getObject(storageKey.userDataDirectory);
        if (!dir) {
          return;
        }
        const listFile = await ScopedStorage.listFiles(dir.uri);
        const existedDir = listFile.find(i => i.name === dirName);
        if (existedDir) {
          await ScopedStorage.deleteFile(existedDir.uri);
        }
      } catch (error) {
        console.log('cleanHistory', error);
      }
    };
    cleanHistory();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Application />
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
