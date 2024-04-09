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
      const newCustomer = {
        number: customerList.length + 1,
        invoiceCode,
        customerName,
        phoneNumber,
        createdAt: new Date().getTime(),
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

    // Tạo đối tượng Date với timestamp đã cung cấp
    // const date = new Date(1712569973142);

    // // Lấy ngày, tháng, năm
    // const day = date.getDate();
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();

    // // Lấy giờ, phút, giây
    // const hours = date.getHours();
    // const minutes = date.getMinutes();
    // const seconds = date.getSeconds();

    // const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    // console.log(formattedDateTime);

    // Thêm khách hàng mới vào danh sách
    // setCustomerList([...customerList, newCustomer]);
    // Lưu danh sách khách hàng vào AsyncStorage
    // await AsyncStorage.setItem(
    //   'customerList',
    //   JSON.stringify([...customerList, newCustomer]),
    // );
    // // Thông báo xác nhận thành công
    // Alert.alert('Success', 'Customer information saved successfully.');
    // // Reset trạng thái của các ô nhập văn bản
    // setInvoiceCode('');
    // setCustomerName('');
    // setPhoneNumber('');
  };

  const isDuplicateInvoiceCode = code => {
    return customerList.some(customer => customer.invoiceCode === code);
  };

  const isValidPhoneNumber = phoneNumber => {
    return /^\d{10}$/.test(phoneNumber);
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
