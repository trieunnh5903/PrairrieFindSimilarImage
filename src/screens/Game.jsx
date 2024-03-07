import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {icons} from '../constant';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {width: screen_width, height: screen_height} = Dimensions.get('window');

const Game = ({navigation}) => {
  const foodStore = useSelector(state => state.food);
  const timePlay = useSelector(state => state.timeToPlay);
  const level = useSelector(state => state.level);
  const timeToDisplayImage = useSelector(state => state.timeToDisplayImage);
  const selectedGame = useSelector(state => state.selectedGame);
  const timeOffImage = timeToDisplayImage * 1000;
  const [isPlaying, setIsPlaying] = useState(false);
  const [images, setImages] = useState([...foodStore, ...foodStore]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const secondsRemaining = useSharedValue(timePlay);
  const intervalIDRef = React.useRef(null);
  const [win, setwin] = useState(false);
  const [selectedImage1, setSelectedImage1] = useState(false);
  const timeoutImage1Visible = React.useRef(null);

  const caculateCellWidth = useMemo(() => {
    const divide = level === 1 ? 3 : level === 2 ? 4 : 5;
    return Math.min(
      (screen_width - 32) / divide,
      (screen_height - screen_width * 0.2 - 32) * divide,
    );
  }, [level]);

  useEffect(() => {
    if (selectedImage1) {
      timeoutImage1Visible.current = setTimeout(() => {
        setSelectedImages(selectedImages[1] || []);
        setSelectedImage1(false);
      }, timeOffImage);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage1]);

  useEffect(() => {
    // tạo mảng hình chưa trộn
    const newArray = [];
    const totalItem = level === 1 ? 9 : level === 2 ? 16 : 25;
    for (let i = 0; i < totalItem; i++) {
      // Lấy phần tử từ mảng gốc theo vòng lặp, nếu mảng gốc đã hết phần tử, quay lại đầu mảng gốc
      const index = i % foodStore.length;
      const imageGift = foodStore[index];
      newArray.push({...imageGift, id: new Date().getTime()});
    }

    setImages(newArray);
    return () => {};
  }, [foodStore, level]);

  useEffect(() => {
    // Hàm này sẽ được gọi mỗi khi trạng thái selectedImages thay đổi
    if (selectedImages.length === 2) {
      // Kiểm tra xem hai hình ảnh giống nhau hay không
      if (
        selectedImages[0].uri === selectedImages[1].uri &&
        selectedImages[1].uri === selectedGame
      ) {
        // Nếu giống nhau, có thể thực hiện các hành động khác ở đây
        onSelectedSuccess();
      } else {
        // Nếu không giống nhau, có thể thực hiện các hành động khác ở đây
        clearTimeout(timeoutImage1Visible.current);
        setTimeout(() => {
          setSelectedImages([]);
          setSelectedImage1(false);
        }, timeOffImage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  const onSelectedSuccess = () => {
    stopTimer();
    setwin(true);
  };

  const handleImagePress = useCallback(
    image => {
      if (selectedImages.length < 2 && !selectedImages.includes(image)) {
        if (selectedImages.length === 0) {
          setSelectedImage1(true);
        }

        const newSelectedImages = [...selectedImages, image];
        setSelectedImages(newSelectedImages);
      }
    },
    [selectedImages],
  );

  const shuffleImages = useCallback(() => {
    let newImages = [...images];
    for (let i = newImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newImages[i], newImages[j]] = [newImages[j], newImages[i]];
    }
    setImages(newImages);
  }, [images]);

  const startTimer = useCallback(() => {
    secondsRemaining.value = withTiming(0, {duration: timePlay * 1000}, () => {
      runOnJS(stopTimer)();
      runOnJS(setModalVisible)(true);
    });
  }, [secondsRemaining, stopTimer, timePlay]);

  const stopTimer = useCallback(() => {
    secondsRemaining.value = timePlay;
    setIsPlaying(false);
  }, [secondsRemaining, timePlay]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      stopTimer();
      setIsPlaying(false);
    });

    return unsubscribe;
  }, [navigation, stopTimer]);

  const onStartPress = () => {
    if (images) {
      setIsPlaying(true);
      setSelectedImages([]);
      shuffleImages();
      startTimer();
      setwin(false);
    }
  };

  const timeRemainingStyle = useAnimatedStyle(() => {
    const width = interpolate(
      secondsRemaining.value,
      [timePlay, 0],
      [screen_width - 34, 0],
    );
    return {width: width};
  });

  console.log(selectedImages);

  return (
    <>
      <View style={styles.container}>
        {/* modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <Pressable
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.textStyle]}>Hết giờ</Text>
            </View>
          </Pressable>
        </Modal>
        <Modal transparent={true} visible={win}>
          <Pressable
            onPress={() => {
              setwin(false);
            }}
            style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.textStyle]}>Win</Text>
            </View>
          </Pressable>
        </Modal>

        <View style={{padding: 16}}>
          <View style={styles.timerWrapper}>
            <Animated.View style={[styles.timer, timeRemainingStyle]} />
          </View>
        </View>
        {/* Hiển thị hình ảnh */}
        <View style={styles.gameWrapper}>
          {/* <View style={{flex: 1, width: '100%'}} /> */}
          <View style={styles.gameContainer}>
            {images.map((image, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                onPress={() => handleImagePress(image)}
                style={[styles.cell, {width: caculateCellWidth}]}>
                {selectedImages.includes(image) ? (
                  <Image source={{uri: image.uri}} style={styles.imageGift} />
                ) : (
                  <Image source={icons.logo} style={styles.imageGift} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          disabled={isPlaying}
          style={styles.buttonStart}
          onPress={onStartPress}>
          <Image
            style={{
              height: screen_width * 0.2,
              width: screen_width * 0.4,
            }}
            resizeMode="contain"
            source={icons.btn_letgo}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Game;

const styles = StyleSheet.create({
  buttonStart: {alignSelf: 'center'},
  imageGift: {width: '100%', height: '100%', borderRadius: 6},
  gameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  disabledText: {
    color: '#a9a9a9',
  },
  timerWrapper: {
    height: 30,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    borderWidth: 1,
  },

  timer: {
    height: 28,
    borderRadius: 4,
    backgroundColor: 'white',
  },

  timerText: {
    fontWeight: 'bold',
    fontSize: 32,
    height: screen_width * 0.2,
    width: screen_width * 0.4,
    textAlign: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    color: 'red',
  },

  cell: {
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 6,
  },
  gameWrapper: {
    // gap: 6,
    padding: 16,
    // flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#A4CC39',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
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
  button: {
    borderRadius: 20,
    // padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    margin: 20,
    zIndex: 1000,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
