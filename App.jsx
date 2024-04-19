import {LogBox, StyleSheet} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import Application from './src/navigators/Application';
LogBox.ignoreAllLogs();
const App = () => {
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
