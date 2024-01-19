import {
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
import {useDispatch, useSelector} from 'react-redux';
import {changeTimeToDisplayImage, changeTimeToPlay} from '../redux/appSlice';
import {useNavigation} from '@react-navigation/native';

const AdminScreen = () => {
  const navigation = useNavigation();
  const {timeToPlay, timeToDisplayImage} = useSelector(state => state.app);
  const [timePlay, setTimePlay] = useState(timeToPlay);
  const [timeDisplay, setTimeDisplay] = useState(timeToDisplayImage);
  const dispatch = useDispatch();
  const onSubmitPress = () => {
    dispatch(changeTimeToDisplayImage(timeDisplay));
    dispatch(changeTimeToPlay(timePlay));
    navigation.navigate('game');
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      <View style={{gap: 6}}>
        <Text style={styles.textBlack}>Thời gian chơi (giây)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={timePlay + ''}
            keyboardType="numeric"
            style={styles.input}
            onChangeText={value => setTimePlay(value)}
          />
        </View>
      </View>

      <View style={{gap: 6}}>
        <Text style={styles.textBlack}>Thời gian hiển thị hình (giây)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            keyboardType="numeric"
            value={timeDisplay + ''}
            style={styles.input}
            onChangeText={value => setTimeDisplay(value)}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={onSubmitPress}
        style={[styles.button, styles.buttonClose]}>
        <Text style={[styles.textStyle]}>Thay đổi</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  textBlack: {
    color: 'black',
  },

  textStyle: {
    color: 'white',
    textAlign: 'center',
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
    margin: 20,
  },

  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
    gap: 16,
  },

  inputWrapper: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
  },

  input: {
    color: 'black',
    textAlign: 'center',
  },
});
