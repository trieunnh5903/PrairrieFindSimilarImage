import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {icons} from '../constant';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {width: screen_width, height: screen_height} = Dimensions.get('window');

const Game = ({navigation}) => {
  const foodStore = useSelector(state => state.imageInGame);
  const level = useSelector(state => state.level);
  const time = useSelector(state => state.time);
  const timePlay = Number(time[level - 1].timePlay); // second
  const timeOffImage = Number(time[level - 1].timeOffImage) * 1000; // milisecond
  const [isPlaying, setIsPlaying] = useState(false);
  const [images, setImages] = useState([...foodStore]);
  const [selectedImages, setSelectedImages] = useState([]);
  const secondsRemaining = useSharedValue(timePlay);
  const [win, setwin] = useState(false);
  const [selectedImage1, setSelectedImage1] = useState(false);
  const timeoutImage1Visible = React.useRef(null);
  const luckyGiftUri = useMemo(() => {
    return images.map(i => {
      if (i.selected === true) {
        return i.uri;
      }
    });
  }, [images]);

  const caculateCellWidth = useMemo(() => {
    return Math.min(
      (screen_width - 32) / 4,
      (screen_height - screen_width * 0.2 - 32) * 4,
    );
  }, []);

  const numberOfCell = level === 1 ? 16 : level === 2 ? 20 : 24;

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

  // console.log(images);
  useEffect(() => {
    const createNewImageArray = () => {
      const listSortImageLucky = [];
      const listSortImageUnlucky = [];
      const listImageLucky = [];
      const listImageUnLucky = [];
      images.map(item => {
        if (item.selected) {
          listSortImageLucky.push(item);
        } else {
          listSortImageUnlucky.push(item);
        }
      });
      // generate image have a gift
      for (let index = 0; index < listSortImageLucky.length; index++) {
        const image = listSortImageLucky[index];
        if (image.selected) {
          const numberOfPair = Number(image.pair[level - 1]);
          for (let j = 0; j < numberOfPair * 2; j++) {
            listImageLucky.push({...image, id: new Date().getTime()});
          }
        }
      }

      // generate image dont have gift
      for (let i = 0; i < numberOfCell - listImageLucky.length; i++) {
        const index = i % listSortImageUnlucky.length;
        const imageGift = listSortImageUnlucky[index];
        listImageUnLucky.push({...imageGift, id: new Date().getTime()});
      }

      return [...listImageUnLucky, ...listImageLucky];
    };

    const newList = createNewImageArray();
    setImages(newList);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedImages.length === 2) {
      if (
        selectedImages[0].uri === selectedImages[1].uri &&
        luckyGiftUri.includes(selectedImages[1].uri)
      ) {
        onSelectedSuccess(selectedImages[0].uri);
      } else {
        clearTimeout(timeoutImage1Visible.current);
        setTimeout(() => {
          setSelectedImages([]);
          setSelectedImage1(false);
        }, timeOffImage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  const onSelectedSuccess = uri => {
    stopTimer();
    setwin(true);
    navigation.navigate('win', {uri});
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

  const shuffleImages = () => {
    let newImages = [...images];
    for (let i = newImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newImages[i], newImages[j]] = [newImages[j], newImages[i]];
    }
    setImages(newImages);
  };

  const startTimer = useCallback(() => {
    secondsRemaining.value = withTiming(
      0,
      {duration: timePlay * 1000},
      isFinished => {
        if (isFinished && !win) {
          runOnJS(navigation.navigate)('lose');
        }
        runOnJS(stopTimer)();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsRemaining, stopTimer, timePlay, win]);

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

  return (
    <View style={styles.container}>
      <View style={{padding: 16}}>
        <View style={styles.timerWrapper}>
          <Animated.View style={[styles.timer, timeRemainingStyle]} />
        </View>
      </View>
      {/* Hiển thị hình ảnh */}
      <View style={styles.gameWrapper}>
        <View style={styles.gameContainer}>
          {images.map((image, index) => (
            <Pressable
              activeOpacity={0.8}
              disabled={!isPlaying}
              key={index}
              onPress={() => isPlaying && handleImagePress(image)}
              style={[styles.cell, {width: caculateCellWidth}]}>
              {selectedImages.includes(image) ? (
                <Animated.Image
                  entering={FadeIn}
                  exiting={FadeOut}
                  source={{uri: image.uri}}
                  style={styles.imageGift}
                />
              ) : (
                <Animated.Image
                  entering={FadeIn}
                  exiting={FadeOut}
                  source={icons.logo}
                  style={styles.imageGift}
                />
              )}
            </Pressable>
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
    height: screen_height - 30 - 64 - screen_width * 0.2,
    overflow: 'hidden',
    gap: 20,
    paddingHorizontal: 16,
    // flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    // backgroundColor: 'red',
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
