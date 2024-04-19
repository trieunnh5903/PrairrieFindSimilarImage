import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {globalStyle} from '../../constant';
import {AppButton, AppTextInput} from '../../components';
import {useDispatch} from 'react-redux';
import {changePassword} from '../../redux/appSlice';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState();
  const [reNewPassword, setReNewPassword] = useState();
  const dispatch = useDispatch();
  const onPress = () => {
    if (newPassword !== reNewPassword) {
      Alert.alert('Thông báo', 'Mật khẩu không khớp');
    }
    if (newPassword) {
      dispatch(changePassword(newPassword));
      Alert.alert('Thông báo', 'Thay đổi thành công');
    }
  };
  return (
    <View style={globalStyle.container}>
      <View style={globalStyle.gap_16}>
        <View style={globalStyle.gap_6}>
          <Text style={globalStyle.textWhite}>Mật khẩu mới</Text>
          <AppTextInput
            value={newPassword}
            onChangeText={t => setNewPassword(t)}
          />
        </View>
        <View style={globalStyle.gap_6}>
          <Text style={globalStyle.textWhite}>Nhập lại mật khẩu</Text>
          <AppTextInput
            value={reNewPassword}
            onChangeText={t => setReNewPassword(t)}
          />
        </View>
        <AppButton label="Thay đổi" onPress={onPress} />
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
