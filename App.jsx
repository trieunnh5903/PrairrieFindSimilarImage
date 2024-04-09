import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AdminScreen from './src/screens/AdminScreen';
import Game from './src/screens/GameScreen';
import Password from './src/screens/Password';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import HomeScreen from './src/screens/HomeScreen';
import {PersistGate} from 'redux-persist/integration/react';
import LoseScreen from './src/screens/LoseScreen';
import WinnerScreen from './src/screens/WinnerScreen';
import {
  CustomerInfoScreen,
  GameScreen,
  ImageScreen,
  ManagerScreen,
  TimeScreen,
} from './src/screens';
import {ScreenName, colors} from './src/constant';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              headerShadowVisible: false,
              headerTitle: '',
              headerStyle: {backgroundColor: colors.primary},
              headerTintColor: 'white',
            }}
            initialRouteName="home">
            <Stack.Screen
              name="password"
              component={Password}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name={ScreenName.ManagerScreen}
              component={ManagerScreen}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name={ScreenName.ImageSettingScreen}
              component={ImageScreen}
            />
            <Stack.Screen
              name={ScreenName.TimeSettingScreen}
              component={TimeScreen}
              options={{headerShown: true}}
            />

            <Stack.Screen
              name={ScreenName.CustomerInfoScreen}
              component={CustomerInfoScreen}
              options={{headerShown: true}}
            />
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="admin" component={AdminScreen} />
            <Stack.Screen name={ScreenName.GameScreen} component={GameScreen} />
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
