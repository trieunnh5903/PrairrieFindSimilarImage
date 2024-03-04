import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

const Password = ({navigation}) => {
  const [password, setPassword] = useState();
  const onPress = () => {
    if (password !== '123456789') {
      Alert.alert('', 'Mật khẩu không đúng');
      return;
    }
    navigation.navigate('admin');
  };
  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      <Text style={{color: 'black'}}>Nhập mật khẩu</Text>
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
        <Text style={{textAlign: 'center', color: 'white'}}>Thay đổi</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default Password;

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
    backgroundColor: '#2196F3',
    margin: 20,
  },
  input: {
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },

  passwordWrapper: {
    marginTop: 6,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
  },
});
