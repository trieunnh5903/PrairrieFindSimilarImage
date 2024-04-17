import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {ScreenName, colors} from '../constant';
import {
  CustomerInfoScreen,
  GameScreen,
  HistoryScreen,
  ImageScreen,
  LocationScreen,
  ManagerScreen,
  PasswordScreen,
  StorageScreen,
  TimeScreen,
} from '../screens';
import HomeScreen from '../screens/HomeScreen';
import LoseScreen from '../screens/LoseScreen';
import WinnerScreen from '../screens/WinnerScreen';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();

const Application = () => {
  return (
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
          name={ScreenName.PasswordScreen}
          component={PasswordScreen}
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
          name={ScreenName.HistoryScreen}
          component={HistoryScreen}
          options={{headerShown: true, headerTitle: 'Lịch sử khách hàng'}}
        />

        <Stack.Screen
          name={ScreenName.ImageSettingScreen}
          component={ImageScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name={ScreenName.TimeSettingScreen}
          component={TimeScreen}
          options={{headerShown: true}}
        />

        <Stack.Screen
          name={ScreenName.LocationScreen}
          component={LocationScreen}
          options={{
            headerShown: true,
          }}
        />

        <Stack.Screen
          name={ScreenName.StorageScreen}
          component={StorageScreen}
          options={{
            headerShown: true,
          }}
        />

        <Stack.Screen
          name={ScreenName.CustomerInfoScreen}
          component={CustomerInfoScreen}
          options={{headerShown: true, headerTitle: 'Thông tin khách hàng'}}
        />

        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name={ScreenName.GameScreen} component={GameScreen} />
        <Stack.Screen name="lose" component={LoseScreen} />
        <Stack.Screen name="win" component={WinnerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Application;

const styles = StyleSheet.create({});
