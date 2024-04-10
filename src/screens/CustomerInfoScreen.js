import {Alert, Keyboard, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenName, globalStyle, storageKey} from '../constant';
import {AppButton, AppTextInput} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerInfoScreen = ({navigation}) => {
  const [invoiceCode, setInvoiceCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    loadCustomerList();
  }, []);

  const loadCustomerList = async () => {
    try {
      const storedCustomerList = await AsyncStorage.getItem(
        storageKey.customerList,
      );
      if (storedCustomerList !== null) {
        setCustomerList(JSON.parse(storedCustomerList));
      }
    } catch (error) {
      console.error('Error loading customer list:', error);
    }
  };

  const handleInvoiceCodeChange = text => {
    setInvoiceCode(text);
  };

  const handleCustomerNameChange = text => {
    setCustomerName(text);
  };

  const handlePhoneNumberChange = text => {
    setPhoneNumber(text);
  };

  const handleSubmit = () => {
    if (!invoiceCode || !customerName || !phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng điền vào tất cả các trường.');
    } else if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert('Lỗi', 'Xin vui lòng nhập một số điện thoại hợp lệ.');
    } else if (isDuplicateInvoiceCode(invoiceCode)) {
      Alert.alert(
        'Lỗi',
        'Mã hóa đơn đã sử dụng. Vui lòng sử dụng một mã khác.',
      );
    } else {
      saveCustomerInformation();
    }
  };

  const saveCustomerInformation = async () => {
    try {
      // Lấy ngày, tháng, năm
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      // Lấy giờ, phút, giây
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

      const newCustomer = {
        ['Ma hoa don']: invoiceCode,
        ['Ten khach hang']: customerName,
        ['So dien thoai']: phoneNumber,
        ['Ngay tao']: formattedDateTime,
      };
      const updatedCustomerList = [...customerList, newCustomer];
      await AsyncStorage.setItem(
        storageKey.customerList,
        JSON.stringify(updatedCustomerList),
      );
      setCustomerList(updatedCustomerList);
      navigation.navigate(ScreenName.GameScreen);
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert(
        'Error',
        'Failed to save customer information. Please try again.',
      );
    }
  };

  const isDuplicateInvoiceCode = code => {
    return customerList.some(customer => customer['Ma hoa don'] === code);
  };

  const isValidPhoneNumber = phoneNumber => {
    return /^0\d{9}$/.test(phoneNumber);
  };

  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={[globalStyle.container, {gap: 16}]}>
      <AppTextInput
        placeholder="Mã hóa đơn"
        keyboardType="number-pad"
        value={invoiceCode}
        onChangeText={handleInvoiceCodeChange}
      />
      <AppTextInput
        placeholder="Tên khách hàng"
        value={customerName}
        onChangeText={handleCustomerNameChange}
      />
      <AppTextInput
        placeholder="Số điện thoại"
        keyboardType="number-pad"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
      />

      <AppButton label="Xác nhận" onPress={handleSubmit} />
    </Pressable>
  );
};

export default CustomerInfoScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
