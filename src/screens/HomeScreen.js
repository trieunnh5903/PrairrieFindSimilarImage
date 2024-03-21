import {
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
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeLevel} from '../redux/appSlice';
import {icons} from '../constant';
import {colors} from '../asset/constant';
import {CommonActions} from '@react-navigation/native';

const width = Dimensions.get('window').width;
const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [timePress, setTimePress] = useState(0);
  const error = useSelector(state => state.error);
  const [modalLevelVisible, setModalLevelVisible] = useState(false);
  const bannerImage = useSelector(state => state.banner);

  const handleButtonPress = () => {
    setModalLevelVisible(true);
  };

  React.useEffect(() => {
    if (error) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'password'}],
        }),
      );
    }
    return () => {};
  }, [error, navigation]);

  const onTimePress = () => {
    setTimePress(pre => pre + 1);

    if (timePress === 5) {
      navigation.navigate('password');
      clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setTimePress(0);
    }, 4000);
  };

  const handleLevelPress = index => {
    dispatch(changeLevel(index));
    setModalLevelVisible(false);
    navigation.navigate('game');
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
          {bannerImage && (
            <Image
              source={{uri: bannerImage}}
              style={{flex: 1}}
              resizeMode="contain"
            />
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
