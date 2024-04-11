import {
  Alert,
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenName} from '../constant/ScreenName';
import {colors, globalStyle} from '../constant';
import {useSelector} from 'react-redux';

const PasswordScreen = ({navigation}) => {
  const error = useSelector(state => state.error);
  useEffect(() => {
    const backAction = () => {
      if (error === true) {
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [error, navigation]);

  const [password, setPassword] = useState();
  const onPress = () => {
    if (password !== '123456789') {
      Alert.alert('', 'Mật khẩu không đúng');
      return;
    }
    navigation.navigate(ScreenName.ManagerScreen);
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      <Text style={{color: 'white'}}>Nhập mật khẩu</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          keyboardType="numeric"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, styles.buttonClose]}>
        <Text style={{textAlign: 'center', color: 'black'}}>Thay đổi</Text>
      </TouchableOpacity>

      <View style={globalStyle.flex_1} />
      <View style={{gap: 20}}>
        <TouchableOpacity style={globalStyle.button}>
          <Text style={[globalStyle.textButton]}>Xuất lịch sử chơi game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyle.button}>
          <Text style={[globalStyle.textButton, {color: 'red'}]}>
            Xóa lịch sử chơi game
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'white',
    margin: 20,
  },
  input: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.primary,
  },

  passwordWrapper: {
    marginTop: 6,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white',
    height: 60,
    justifyContent: 'center',
  },
});
