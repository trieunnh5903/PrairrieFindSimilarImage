import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeLevel} from '../redux/appSlice';
import {icons} from '../asset';
import {ScreenName, colors} from '../constant';
import * as ScopedStorage from 'react-native-scoped-storage';

const width = Dimensions.get('window').width;
const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [timePress, setTimePress] = useState(0);
  const [modalLevelVisible, setModalLevelVisible] = useState(false);
  const bannerImage = useSelector(state => state.banner);
  const listImage = useSelector(state => state.imageInGame);
  const imageLose = useSelector(state => state.loseImage);
  const timeStore = useSelector(state => state.time);
  const location = useSelector(state => state.location);
  const validate = useCallback(async () => {
    try {
      const pairRegex = /^(0(\.5)?|[1-9]\d*(\.5)?)$/;
      const timeRegex = /^(0|[1-9]\d*)(\.\d+)?$/;
      const persistedUris = await ScopedStorage.getPersistedUriPermissions();
      if (persistedUris.length === 0) {
        Alert.alert('Thông báo', 'Thư mục lưu trữ trống');
        return false;
      }

      if (!location) {
        Alert.alert('Thông báo', 'Điểm bán hàng trống');
        return false;
      }

      if (listImage.length === 0) {
        Alert.alert('Thông báo', 'Hình ảnh game trống');
        return false;
      }

      const listGift = listImage.filter(i => i.selected === true);
      if (listGift.length <= 0) {
        Alert.alert('Thông báo', 'Hình ảnh phần quà trống');
        return false;
      } else {
        for (let index = 0; index < listGift.length; index++) {
          const element = listGift[index];
          if (!element.giftUri) {
            Alert.alert('Thông báo', 'Hình ảnh phần quà trống');
            return false;
          }
          if (!element.name) {
            Alert.alert('Thông báo', 'Tên phần quà trống');
            return false;
          }
          const pairs = element?.pair;
          if (!pairs) {
            Alert.alert('Thông báo', 'Số cặp trống');
            return false;
          } else {
            if (
              !pairRegex.test(pairs[0]) ||
              !pairRegex.test(pairs[1]) ||
              !pairRegex.test(pairs[2])
            ) {
              Alert.alert('Thông báo', 'Số cặp không đúng');
              return false;
            }
          }
        }
      }

      if (!imageLose) {
        Alert.alert('Thông báo', 'Hình ảnh thua cuộc trống');
        return false;
      }

      for (let index = 0; index < timeStore.length; index++) {
        const element = timeStore[index];
        if (
          !timeRegex.test(element.timePlay) ||
          !timeRegex.test(element.timeOffImage)
        ) {
          Alert.alert('Thông báo', 'Thời gian không đúng');
          return false;
        }
      }

      if (!bannerImage) {
        Alert.alert('Thông báo', 'Hình ảnh Banner trống');
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }, [bannerImage, imageLose, listImage, location, timeStore]);

  const handleButtonPress = async () => {
    const result = await validate();
    if (result) {
      setModalLevelVisible(true);
    }
  };

  const onTimePress = () => {
    setTimePress(pre => pre + 1);

    if (timePress === 5) {
      navigation.navigate(ScreenName.HistoryScreen);
      clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setTimePress(0);
    }, 4000);
  };

  const handleLevelPress = index => {
    dispatch(changeLevel(index));
    setModalLevelVisible(false);
    navigation.navigate(ScreenName.CustomerInfoScreen);
  };

  return (
    <ImageBackground source={icons.bgHome} style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalLevelVisible}
        onRequestClose={() => setModalLevelVisible(false)}>
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setModalLevelVisible(false)}
            style={styles.modalOverlay}
          />
          <View style={styles.modalView}>
            {['Dễ', 'Trung bình', 'Khó'].map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => handleLevelPress(index + 1)}
                  key={item}
                  activeOpacity={0.8}
                  style={styles.buttonLevel}>
                  <Text style={styles.buttonLevelText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      <View style={{alignItems: 'center'}}>
        <Image
          source={icons.logo_removebg}
          style={{width: 60, height: (60 / 500) * 815, margin: 10}}
          resizeMode="contain"
        />
      </View>
      <View style={styles.banner}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleButtonPress()}
          style={{flex: 1}}>
          {bannerImage ? (
            <Image
              source={{uri: bannerImage}}
              style={{flex: 1}}
              resizeMode="contain"
            />
          ) : (
            <View style={{flex: 1, borderWidth: 1}} />
          )}
        </TouchableOpacity>
      </View>

      <View>
        <Image
          source={icons.text_home}
          style={{
            width: 200,
            height: (200 / 1000) * 320,
            alignSelf: 'center',
            marginBottom: -40,
          }}
          resizeMode="contain"
        />
        <Image
          source={icons.gift}
          style={{width: width, height: (width / 250) * 101}}
          resizeMode="contain"
        />
      </View>
      <Pressable onPress={onTimePress} style={styles.admin} />
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonLevel: {
    backgroundColor: colors.primary,
    width: width * 0.4,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLevelText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    gap: 16,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  admin: {
    width: width * 0.3,
    height: width * 0.3,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  imageGift: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 8,
  },
  banner: {
    flex: 1,
    padding: 16,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignSelf: 'center',
    // justifyContent: 'center',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white', // Màu văn bản của nút
    fontSize: 18,
  },
});
