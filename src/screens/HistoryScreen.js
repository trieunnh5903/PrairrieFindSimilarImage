import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  ScreenName,
  colors,
  globalStyle,
  screenWidth,
  storageKey,
} from '../constant';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDate, storage} from '../utils';
import * as ScopedStorage from 'react-native-scoped-storage';
import XLSX, {utils} from 'xlsx';
import Mailer from 'react-native-mail';
import {useSelector} from 'react-redux';
import {LocationIcon} from '../asset';
import {AppButton} from '../components';

const HistoryScreen = ({navigation}) => {
  const location = useSelector(state => state.location);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timePress, setTimePress] = useState(0);
  const [dateModalValue, setDateModalValue] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showModalLoading = () => setIsLoading(true);

  const hideModalLoading = () => setIsLoading(false);

  const handleConfirm = dateValue => {
    setDateModalValue(dateValue);
    hideDatePicker();
  };

  const onTimePress = () => {
    setTimePress(pre => pre + 1);

    if (timePress === 5) {
      navigation.navigate(ScreenName.PasswordScreen);
      clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setTimePress(0);
    }, 4000);
  };

  const checkLocation = () => {
    if (!location) {
      Alert.alert('Thông báo', 'Điểm cửa hàng thiếu');
      return false;
    }
    return true;
  };

  const checkPermission = async () => {
    try {
      const persistedUris = await ScopedStorage.getPersistedUriPermissions();
      if (persistedUris.length > 0) {
        return true;
      }
      Alert.alert('Lỗi', 'Ứng dụng không có quyền truy cập vào bộ nhớ');
      return false;
    } catch (error) {
      console.log('checkPermission', error);
      return false;
    }
  };

  const onSendPress = async () => {
    try {
      const isLocationExsited = checkLocation();
      if (!isLocationExsited) {
        return;
      }

      const granted = await checkPermission();
      if (!granted) {
        return;
      }

      showModalLoading();
      const file = await exportFile();
      if (!file) {
        return;
      }
      await sendMail(file);
    } catch (error) {
      console.log('onSendPress', error);
    } finally {
      hideModalLoading();
    }
  };

  const sendMail = file => {
    return new Promise((resolve, reject) => {
      if (!file.uri || !file.mime) {
        return resolve(false);
      }
      Mailer.mail(
        {
          subject: `${location || 'Thiếu'} (${formatDate(
            dateModalValue,
          )}) - Báo cáo lịch sử chơi game xếp hình`,
          recipients: ['nguyennhathaitrieu5903@gmail.com'],
          body: `Báo cáo lịch sử chơi game xếp hình \n Cửa hàng: ${location} \n Ngày: ${formatDate(
            dateModalValue,
          )} `,
          customChooserTitle: 'Báo cáo lịch sử chơi game xếp hình',
          isHTML: false,
          attachments: [
            {
              uri: file.uri,
              type: file.mime,
            },
          ],
        },
        (error, event) => {
          if (error) {
            return reject(error);
          }
          Alert.alert('Lỗi', 'Gửi email gặp lỗi');
        },
      );
      resolve(true);
    });
  };

  const exportFile = async () => {
    try {
      // generate data
      const workbook = await generateDataXlsx();
      if (!workbook) {
        Alert.alert('Thông báo', 'Dữ liệu trống');
        return;
      }
      const b64 = XLSX.write(workbook, {type: 'base64', bookType: 'xlsx'});

      // generate file
      const dir = await storage.getObject(storageKey.userDataDirectory);
      if (!dir) {
        return;
      }
      const dirName = 'Prairie Lucky Wheel';
      const listFile = await ScopedStorage.listFiles(dir.uri);
      const existedDir = listFile.find(i => i.name === dirName);
      const prairieDir = !existedDir
        ? await ScopedStorage.createDirectory(dir.uri, dirName)
        : existedDir;

      const filePatch = await ScopedStorage.writeFile(
        prairieDir.uri,
        b64,
        `${(location || '').toLowerCase()} xep_hinh ${formatDate(
          dateModalValue,
        )}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'base64',
      );

      const file = {
        uri: filePatch,
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      return file;
    } catch (error) {
      console.log('exportFile', error);
    }
  };

  const generateDataXlsx = async () => {
    try {
      // get data in async storage
      const customerList = await storage.getObject(storageKey.customerList);
      const filteredCustomerList = await customerList.filter(item => {
        return item['Ngay tao'].startsWith(formatDate(dateModalValue));
      });
      // console.log('filteredCustomerList', filteredCustomerList);
      if (filteredCustomerList.length === 0) {
        return null;
      }
      // conver to xlsx sheet
      const ws = utils.json_to_sheet(filteredCustomerList);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'SheetJS');
      return wb;
    } catch (error) {}
  };

  const onPress = () => {
    storage.setObjData(storageKey.customerList, sample_data);
  };

  return (
    <View style={[globalStyle.container, styles.container]}>
      <Modal animationType="fade" transparent visible={isLoading}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        </View>
      </Modal>
      {/* <AppButton label="tao" onPress={onPress} /> */}
      <View style={styles.history}>
        <View style={[globalStyle.row, globalStyle.gap_6]}>
          <LocationIcon width={20} height={20} />
          <Text style={globalStyle.textBlack}>{location || 'Trống'}</Text>
        </View>
        <View style={styles.sendWrapper}>
          <TouchableOpacity
            style={styles.dateContainer}
            activeOpacity={0.6}
            onPress={showDatePicker}>
            <Text style={styles.textBlack}>Ngày gửi lịch sử</Text>
            <Text style={styles.textDate}>{formatDate(dateModalValue)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onSendPress}
            style={styles.buttonSendContainer}>
            <Text style={[globalStyle.textWhite, styles.btnSendText]}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={dateModalValue}
      />
      <Pressable onPress={onTimePress} style={styles.admin} />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  sendWrapper: {flexDirection: 'row', gap: 16},
  modalContainer: {
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
  },

  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSendText: {flex: 1, fontSize: 18, textAlignVertical: 'center'},
  buttonSendContainer: {
    backgroundColor: colors.primary,
    flex: 1,
    borderRadius: 16,
    height: '100%',
    alignItems: 'center',
  },
  textDate: {color: colors.primary, fontSize: 16, fontWeight: 'bold'},
  textBlack: {color: 'black', fontSize: 16},
  dateContainer: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  history: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    gap: 10,
    width: '100%',
  },
  container: {justifyContent: 'center', alignItems: 'center'},
  admin: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

const sample_data = [
  {
    'Ma hoa don': '1',
    'Ten khach hang': 'Mathian',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '12.135.229.120',
  },
  {
    'Ma hoa don': '2',
    'Ten khach hang': 'Wilma',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '3',
    'Ten khach hang': 'Gradey',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '4',
    'Ten khach hang': 'Carny',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '5',
    'Ten khach hang': 'Maire',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '6',
    'Ten khach hang': 'Kelcey',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '7',
    'Ten khach hang': 'Jenna',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '8',
    'Ten khach hang': 'Sawyer',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '9',
    'Ten khach hang': 'Barbey',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '10',
    'Ten khach hang': 'Travers',
    'So dien thoai': '0123456789',
    'Ngay tao': '10/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '10/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '11',
    'Ten khach hang': 'Danette',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '12',
    'Ten khach hang': 'Fayina',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Chúc bạn may mắn lần sau',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '13',
    'Ten khach hang': 'Maurie',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '14',
    'Ten khach hang': 'Madelene',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '15',
    'Ten khach hang': 'Mirna',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '16',
    'Ten khach hang': 'Tan',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '17',
    'Ten khach hang': 'Rasia',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '18',
    'Ten khach hang': 'Anetta',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '19',
    'Ten khach hang': 'Graeme',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '20',
    'Ten khach hang': 'Stephine',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '21',
    'Ten khach hang': 'Laurena',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '22',
    'Ten khach hang': 'Bronson',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '23',
    'Ten khach hang': 'Dov',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '24',
    'Ten khach hang': 'Randa',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '25',
    'Ten khach hang': 'Jaymee',
    'So dien thoai': '0123456789',
    'Ngay tao': '11/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '11/4/2024 16:8:7',
  },
  {
    'Ma hoa don': '26',
    'Ten khach hang': 'Leland',
    'So dien thoai': '0123456789',
    'Ngay tao': '12/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '106.240.16.193',
  },
  {
    'Ma hoa don': '27',
    'Ten khach hang': 'Cathi',
    'So dien thoai': '0123456789',
    'Ngay tao': '12/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '34.33.35.242',
  },
  {
    'Ma hoa don': '28',
    'Ten khach hang': 'Lars',
    'So dien thoai': '0123456789',
    'Ngay tao': '12/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '133.39.178.215',
  },
  {
    'Ma hoa don': '29',
    'Ten khach hang': 'Collin',
    'So dien thoai': '0123456789',
    'Ngay tao': '12/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '2.107.131.240',
  },
  {
    'Ma hoa don': '30',
    'Ten khach hang': 'Dode',
    'So dien thoai': '0123456789',
    'Ngay tao': '12/4/2024 16:8:7',
    'Ket qua': 'Bánh cá kem',
    'Thoi gian choi': '126.193.250.129',
  },
];
