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
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';

const {width: screen_width} = Dimensions.get('window');
const Game = ({navigation}) => {
  const {timeToPlay, timeToDisplayImage, selectedGame} = useSelector(
    state => state.app,
  );
  const timePlay = timeToPlay;
  const timeOffImage = timeToDisplayImage * 1000;
  const [isPlaying, setIsPlaying] = useState(false);
  const [images, setImages] = useState([
    // dứa
    {
      id: 1,
      uri: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // dâu
    {
      id: 2,
      uri: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // cam
    {
      id: 3,
      uri: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // chuoi
    {
      id: 4,
      uri: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // cherry
    {
      id: 5,
      uri: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    //  dudu
    {
      id: 11,
      uri: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // dứa
    {
      id: 6,
      uri: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // dâu
    {
      id: 7,
      uri: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // cam
    {
      id: 8,
      uri: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // chuoi
    {
      id: 9,
      uri: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // cherry
    {
      id: 10,
      uri: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    //  dudu
    {
      id: 12,
      uri: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(timePlay);
  const intervalIDRef = React.useRef(null);
  const [timePress, setTimePress] = useState(0);
  const animationRef = useRef(null);

  const [win, setwin] = useState(false);
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
        setTimeout(() => {
          setSelectedImages([]);
        }, timeOffImage);
      }
      // Đặt lại danh sách hình ảnh đã chọn
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  const onSelectedSuccess = () => {
    stopTimer();
    setIsPlaying(false);
    setwin(true);
    animationRef.current?.play(0);
  };

  // const pickImage = () => {
  //   ImagePicker.launchImageLibrary({}, response => {
  //     if (!response.didCancel) {
  //       const newImages = [...images, {id: images.length, uri: response.uri}];
  //       setImages(newImages);
  //     }
  //   });
  // };

  const handleImagePress = image => {
    if (selectedImages.length < 2 && !selectedImages.includes(image)) {
      const newSelectedImages = [...selectedImages, image];
      setSelectedImages(newSelectedImages);
    }
  };

  const shuffleImages = () => {
    let newImages = [...images];
    for (let i = newImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newImages[i], newImages[j]] = [newImages[j], newImages[i]];
    }
    setImages(newImages);
  };

  // time out
  useEffect(() => {
    if (secondsRemaining <= 0) {
      // Thực hiện các hành động khi thời gian hết ở đây
      stopTimer();
      setModalVisible(true);
      setIsPlaying(false);
    }
  }, [secondsRemaining]);

  const startTimer = () => {
    setSecondsRemaining(timePlay);
    intervalIDRef.current = setInterval(() => {
      setSecondsRemaining(pre => pre - 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalIDRef.current);
    intervalIDRef.current = null;
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      stopTimer();
      setIsPlaying(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const onStartPress = () => {
    if (images) {
      setIsPlaying(true);
      setSelectedImages([]);
      shuffleImages();
      startTimer();
      setwin(false);
      animationRef.current?.reset();
    }
  };

  const onTimePress = () => {
    setTimePress(pre => pre + 1);

    if (timePress === 5) {
      navigation.navigate('password');
    }

    setTimeout(() => {
      setTimePress(0);
    }, 4000);
  };

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
            <View onPress={onTimePress} style={styles.modalView}>
              <Text style={[styles.textStyle]}>Hết giờ</Text>
            </View>
          </Pressable>
        </Modal>
        {/* Hiển thị hình ảnh */}
        <Pressable onPress={onTimePress} style={styles.timer}>
          <Text style={styles.timerText}>{`${secondsRemaining} giây`}</Text>
        </Pressable>
        <View style={styles.gameWrapper}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => intervalIDRef.current && handleImagePress(image)}
              style={styles.cell}>
              {selectedImages.includes(image) ? (
                <Image
                  source={{uri: image.uri}}
                  style={{width: '100%', height: '100%'}}
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'gray',
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          disabled={isPlaying}
          style={[
            styles.button,
            styles.buttonClose,
            isPlaying && styles.disabledButton,
          ]}
          onPress={onStartPress}>
          <Text
            style={[
              styles.textStyle,
              {color: 'white'},
              isPlaying && styles.disabledText,
            ]}>
            Bắt đầu
          </Text>
        </TouchableOpacity>

        {win && (
          <LottieView
            autoPlay
            source={require('../asset/confettie.json')}
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          />
        )}
      </View>
    </>
  );
};

export default Game;

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  disabledText: {
    color: '#a9a9a9',
  },
  timer: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 20,
  },

  timerText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },

  cell: {
    width: screen_width * 0.3,
    aspectRatio: 1,
  },
  gameWrapper: {
    gap: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
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
    padding: 10,
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
