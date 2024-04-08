import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors, globalStyle} from '../constant';
import {ScreenName} from '../constant/ScreenName';

const ManagerScreen = ({navigation}) => {
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

      <TouchableOpacity
        onPress={() => navigation.navigate(ScreenName.TimeSettingScreen)}
        style={globalStyle.button}>
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
