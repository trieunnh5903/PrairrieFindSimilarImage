import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppTextInput, AppButton} from '../../components';
import {globalStyle} from '../../constant';
import {useSelector, useDispatch} from 'react-redux';
import {changeLocation} from '../../redux/appSlice';

const LocationScreen = ({navigation}) => {
  const location = useSelector(state => state.location);
  const dispatch = useDispatch();
  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={globalStyle.container}>
      <AppTextInput
        value={location}
        onChangeText={text => dispatch(changeLocation(text))}
        placeholder="Điểm bán hiện tại"
      />
    </Pressable>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({});
