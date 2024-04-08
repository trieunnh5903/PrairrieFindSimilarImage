import {Alert, Keyboard, Pressable, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {globalStyle} from '../constant';
import {AppButton, AppTextInput} from '../components';

const CustomerInfoScreen = () => {
  const [invoiceCode, setInvoiceCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
    } else {
      console.log('Invoice Code:', invoiceCode);
      console.log('Customer Name:', customerName);
      console.log('Phone Number:', phoneNumber);
    }
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
