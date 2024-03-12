import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AdminScreen from './src/screens/AdminScreen';
import Game from './src/screens/Game';
import Password from './src/screens/Password';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import HomeScreen from './src/screens/HomeScreen';
import {PersistGate} from 'redux-persist/integration/react';
import LoseScreen from './src/screens/LoseScreen';
import WinnerScreen from './src/screens/WinnerScreen';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="home">
            <Stack.Screen name="password" component={Password} />
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="admin" component={AdminScreen} />
            <Stack.Screen name="game" component={Game} />
            <Stack.Screen name="lose" component={LoseScreen} />
            <Stack.Screen name="win" component={WinnerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
