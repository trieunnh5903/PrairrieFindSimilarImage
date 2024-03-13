import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeFood,
  changeLoseImage,
  changeTimeToDisplayImage,
  changeTimeToPlay,
} from '../redux/appSlice';
import ImagePicker from 'react-native-image-crop-picker';

const {width} = Dimensions.get('window');
const AdminScreen = ({navigation}) => {
  const foodStore = useSelector(state => state.food);
  const loseImageStore = useSelector(state => state.loseImage);
  const timeToPlay = useSelector(state => state.timeToPlay);
  const timeToDisplayImage = useSelector(state => state.timeToDisplayImage);
  const [listImage, setListImage] = useState(foodStore);
  const [imageLose, setImageLose] = useState(loseImageStore);
  const [timePlay, setTimePlay] = useState(timeToPlay);
  const [timeDisplay, setTimeDisplay] = useState(timeToDisplayImage);
  const dispatch = useDispatch();

  console.log(listImage);
  const onSubmitPress = () => {
    const result = validate();
    if (result === false) {
      return;
    }
    // dispatch(changeTimeToDisplayImage(timeDisplay));
    // dispatch(changeTimeToPlay(timePlay));
    dispatch(changeFood(listImage));
    dispatch(changeLoseImage(imageLose));
    Alert.alert('Thông báo', 'Thay đổi thành công');
  };

  const validate = () => {
    if (listImage.length === 0) {
      Alert.alert('Thông báo', 'Hình ảnh game trống');
      return false;
    }

    let gift = 0;
    let luckyRate = 0;
    for (let element of listImage) {
      if (element.selected) {
        gift++;
        if (!element.giftUri) {
          Alert.alert('Thông báo', 'Hình ảnh phần quà trống');
          return false;
        }

        if (!element.rate) {
          Alert.alert('Thông báo', 'Tỉ lệ trống');
          return false;
        }

        if (isNaN(Number(element.rate))) {
          Alert.alert('Thông báo', 'Tỉ lệ phải là số');
          return false;
        }

        if (Number(element.rate) < 0) {
          Alert.alert('Thông báo', 'Tỉ lệ phải là số không âm');
          return false;
        }

        luckyRate = luckyRate + Number(element.rate);
      }
    }

    if (luckyRate >= 100) {
      Alert.alert('Thông báo', 'Tỉ lệ quà không quá 100%');
      return false;
    }

    if (!imageLose) {
      Alert.alert('Thông báo', 'Hình ảnh thua cuộc trống');
      return false;
    }

    if (gift === 0) {
      Alert.alert('Thông báo', 'Hình ảnh phần quà trống');
      return false;
    }

    // if (timeDisplay <= 0) {
    //   Alert.alert('', 'Thời gian lật hình không đúng');
    //   return false;
    // }

    // if (timePlay <= 0) {
    //   Alert.alert('', 'Thời gian chơi không đúng');
    //   return false;
    // }

    return true;
  };

  console.log(Number('0--') > 0);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleSelectImage = async () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then(images => {
        const formartImages = images.map(i => ({uri: i.path}));
        setListImage(formartImages);
      })
      .catch(() => {});
  };

  const handleLoseImagePress = async () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(result => {
        setImageLose(result.path);
      })
      .catch(() => {});
  };

  const onImagePress = image => {
    const updateImage = listImage.map(item => {
      if (image.uri === item.uri) {
        return {...item, selected: !item.selected};
      } else {
        return item;
      }
    });
    setListImage(updateImage);
  };

  const handleImageGift = uri => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(result => {
        const newListImage = listImage.map(item => {
          if (item.selected && item.uri === uri) {
            return {...item, giftUri: result.path};
          } else {
            return item;
          }
        });

        setListImage(newListImage);
      })
      .catch(() => {});
  };

  const onRateChange = (text, imageUri) => {
    const newListImage = listImage.map(item => {
      if (item.uri === imageUri) {
        return {...item, rate: text};
      } else {
        return item;
      }
    });

    setListImage(newListImage);
  };

  const unluckyRate = useMemo(() => {
    const rate = listImage.reduce((acc, curr) => {
      if (curr.rate) {
        return acc + Number(curr.rate);
      } else {
        return acc + 0;
      }
    }, 0);
    return 100 - rate;
  }, [listImage]);

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
        <View style={{gap: 6}}>
          <View style={styles.selectImageWrapper}>
            <Text style={[styles.textBlack, styles.textLabel]}>
              Hình ảnh game
            </Text>

            <TouchableOpacity
              onPress={handleSelectImage}
              style={[styles.button]}>
              <Text style={[styles.textStyle]}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.textGray]}>
            Ấn vào hình ảnh để chuyển ảnh sang phần quà
          </Text>
        </View>

        <View style={styles.imageWrapper}>
          {listImage.length > 0 ? (
            listImage?.map(item => {
              return (
                <TouchableOpacity
                  key={item.uri}
                  activeOpacity={0.8}
                  style={[styles.image, item.selected && styles.selectedImage]}
                  onPress={() => onImagePress(item)}>
                  <Image
                    resizeMode="contain"
                    source={{uri: item.uri}}
                    style={styles.image}
                  />
                  {item.selected && (
                    <Image
                      source={require('../asset/selected.png')}
                      style={styles.selected}
                    />
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.textGray}>(Trống)</Text>
          )}
        </View>

        {/* <Text style={[styles.textBlack, styles.textGray]}>
          Số ảnh chơi game: {listImage.length || 0}
        </Text>
        <Text style={[styles.textBlack, styles.textGray]}>
          Số phần quà: {listImage.filter(i => i.selected === true).length || 0}
        </Text> */}

        <View>
          <Text style={[styles.textBlack, styles.textLabel]}>
            Hình ảnh phần quà
          </Text>
          <View style={{gap: 16, marginTop: 16}}>
            {listImage.map(image => {
              if (image.selected) {
                return (
                  <View style={styles.rowGift} key={'qua' + image.uri}>
                    <View style={styles.giftWrapper}>
                      <Image
                        resizeMode="contain"
                        source={{uri: image.uri}}
                        style={styles.gift}
                      />
                    </View>

                    <Image
                      resizeMode="contain"
                      style={{width: width * 0.1, height: width * 0.1}}
                      source={require('../asset/right_arrow.png')}
                    />

                    <TouchableOpacity
                      onPress={() => handleImageGift(image.uri)}
                      activeOpacity={0.8}
                      style={styles.giftWrapper}>
                      {image.giftUri ? (
                        <Image
                          resizeMode="contain"
                          source={{uri: image.giftUri}}
                          style={styles.gift}
                        />
                      ) : (
                        <View style={[styles.gift, styles.giftEmpty]}>
                          <Text style={styles.textGray}>Trống</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
            {listImage.filter(i => i.selected === true).length > 0 ===
              false && (
              <Text style={[{marginVertical: 6}, styles.textGray]}>
                (Trống)
              </Text>
            )}
          </View>
        </View>

        <View style={{gap: 16}}>
          <Text style={[styles.textBlack, styles.textLabel]}>
            Hình ảnh thua cuộc
          </Text>
          {imageLose ? (
            <Image
              resizeMode="contain"
              style={styles.image}
              source={{
                uri: imageLose,
              }}
            />
          ) : (
            <Text style={styles.textGray}>(Trống)</Text>
          )}
          <TouchableOpacity
            onPress={handleLoseImagePress}
            style={[styles.button]}>
            <Text style={[styles.textStyle]}>Chọn ảnh</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={[styles.textBlack, styles.textLabel]}>Tỉ lệ (%)</Text>
          <View style={{gap: 16, marginTop: 16}}>
            {listImage.map(image => {
              if (image.selected) {
                return (
                  <View style={styles.rowGift} key={'Tỉ lệ' + image.uri}>
                    <View style={styles.giftWrapper}>
                      <Image
                        resizeMode="contain"
                        source={{uri: image.uri}}
                        style={styles.gift}
                      />
                    </View>

                    <Image
                      resizeMode="contain"
                      style={{width: width * 0.1, height: width * 0.1}}
                      source={require('../asset/right_arrow.png')}
                    />

                    <View style={styles.giftWrapper}>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          value={image.rate}
                          keyboardType="numeric"
                          onChangeText={text => onRateChange(text, image.uri)}
                          placeholder="Nhập tỉ lệ"
                          style={[
                            {marginHorizontal: 16, flex: 1},
                            styles.textBlack,
                          ]}
                        />
                        <Text style={[styles.textBlack, {marginRight: 16}]}>
                          %
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }
            })}

            {imageLose && (
              <View style={styles.rowGift} key={'Tỉ lệ' + imageLose}>
                <View style={styles.giftWrapper}>
                  <Image
                    resizeMode="contain"
                    source={{uri: imageLose}}
                    style={styles.gift}
                  />
                </View>

                <Image
                  resizeMode="contain"
                  style={{width: width * 0.1, height: width * 0.1}}
                  source={require('../asset/right_arrow.png')}
                />

                <View style={styles.giftWrapper}>
                  <View style={styles.inputWrapper}>
                    <Text
                      numberOfLines={1}
                      style={[
                        {margin: 13, flex: 1},
                        styles.textBlack,
                      ]}>{`${unluckyRate}`}</Text>
                    <Text style={[styles.textBlack, {marginRight: 16}]}>%</Text>
                  </View>
                </View>
              </View>
            )}

            {listImage.length <= 0 && !imageLose && (
              <Text style={styles.textGray}>(Trống)</Text>
            )}
          </View>
        </View>

        {/* <View style={{gap: 6}}>
          <Text style={styles.textBlack}>Thời gian chơi (giây)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={timePlay + ''}
              keyboardType="numeric"
              style={styles.input}
              onChangeText={value => setTimePlay(value)}
            />
          </View>
        </View>

        <View style={{gap: 6}}>
          <Text style={styles.textBlack}>Thời gian hiển thị hình (giây)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              keyboardType="numeric"
              value={timeDisplay + ''}
              style={styles.input}
              onChangeText={value => setTimeDisplay(value)}
            />
          </View>
        </View> */}

        <TouchableOpacity onPress={onSubmitPress} style={[styles.button]}>
          <Text style={[styles.textStyle]}>Thay đổi</Text>
        </TouchableOpacity>
      </Pressable>
    </ScrollView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  textGray: {fontSize: 16, color: 'gray'},
  textLabel: {
    fontSize: 20,
  },
  giftEmpty: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftWrapper: {flex: 1, borderRadius: 6},
  gift: {width: '100%', aspectRatio: 1, borderRadius: 6},
  rowGift: {
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 2,
    width: '20%',
    height: '20%',
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: width,
  },
  imageSelected: {borderWidth: 3},
  imageWrapper: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  image: {
    width: (width - 32) / 2 - 10,
    height: (width - 32) / 2 - 10,
    borderRadius: 6,
  },

  selectedImage: {
    borderWidth: 1,
    borderColor: 'rgb(37, 150, 190)',
  },

  textBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },

  selectImageWrapper: {flexDirection: 'row', gap: 20, alignItems: 'center'},

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },

  buttonClose: {
    backgroundColor: '#2196F3',
    margin: 20,
  },

  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
    gap: 16,
  },

  inputWrapper: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    color: 'black',
    textAlign: 'center',
  },
});
