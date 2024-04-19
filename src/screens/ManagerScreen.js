import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {colors, globalStyle} from '../constant';
import {ScreenName} from '../constant/ScreenName';
import {AppButton} from '../components';

const ManagerScreen = ({navigation}) => {
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const showModal = () => setModalImageVisible(true);
  const hideModal = () => setModalImageVisible(false);
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalImageVisible}
        onRequestClose={hideModal}>
        <View style={styles.centeredView}>
          <Pressable onPress={hideModal} style={styles.modalOverlay} />
          <View style={styles.modalView}>
            <Text style={[globalStyle.textBlack, {textAlign: 'center'}]}>
              Chọn hình ảnh cần sửa
            </Text>

            <View style={{gap: 16}}>
              <Pressable
                onPress={() => {
                  navigation.navigate(ScreenName.StandByImage);
                  hideModal();
                }}>
                <Text style={{color: 'black'}}>Màn hình Stand By</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate(ScreenName.ImageSettingScreen);
                  hideModal();
                }}>
                <Text style={{color: 'black'}}>Màn hình Game</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <AppButton label="Hình ảnh trò chơi" onPress={showModal} />

      <AppButton
        label="Thời gian chơi game"
        onPress={() => navigation.navigate(ScreenName.TimeSettingScreen)}
      />
      <AppButton
        label="Điểm bán hiện tại"
        onPress={() => navigation.navigate(ScreenName.LocationScreen)}
      />

      <AppButton
        label="Lưu trữ"
        onPress={() => navigation.navigate(ScreenName.StorageScreen)}
      />
      <AppButton
        label="Đổi mật khẩu"
        onPress={() => navigation.navigate(ScreenName.ChangePassword)}
      />
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
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    gap: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
