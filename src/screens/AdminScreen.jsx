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
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeLoseImage,
  changeTimeToPlay,
  changeTimeOffImage,
  addImages,
  updateImages,
  updatePair,
  changeBannerImage,
} from '../redux/appSlice';
import ImagePicker from 'react-native-image-crop-picker';

const {width} = Dimensions.get('window');
const AdminScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const listImage = useSelector(state => state.imageInGame);
  const imageLose = useSelector(state => state.loseImage);
  const timeStore = useSelector(state => state.time);
  const bannerImage = useSelector(state => state.banner);

  const onChangeTimePlay = (value, index) => {
    dispatch(changeTimeToPlay({value, index}));
  };

  const onChangeTimeOff = (value, index) => {
    dispatch(changeTimeOffImage({value, index}));
  };

  const onSubmitPress = () => {
    const result = validate();
    if (result === false) {
      return;
    }
    Alert.alert('Thông báo', 'Thay đổi thành công');
  };

  const validate = () => {
    const pairRegex = /^(0(\.5)?|[1-9]\d*(\.5)?)$/;
    const timeRegex = /^(0|[1-9]\d*)(\.\d+)?$/;
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
  };

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

  const handleSelectImageInGame = async () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then(images => {
        const formartImages = images.map(i => ({uri: i.path}));
        dispatch(addImages(formartImages));
      })
      .catch(() => {});
  };

  const handleLoseImagePress = async () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(result => {
        dispatch(changeLoseImage(result.path));
      })
      .catch(() => {});
  };

  const handleBannerImagePress = async () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(result => {
        dispatch(changeBannerImage(result.path));
      })
      .catch(() => {});
  };

  const onImageInGamePress = image => {
    const newImages = listImage.map(item => {
      if (image.uri === item.uri) {
        return {...item, selected: !item.selected};
      } else {
        return item;
      }
    });
    dispatch(updateImages(newImages));
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

        dispatch(updateImages(newListImage));
      })
      .catch(() => {});
  };

  const onPairChange = (text, imageUri, level) => {
    dispatch(updatePair({value: text, uri: imageUri, level}));
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
        {/* imgae in game */}
        <View style={styles.gap_6}>
          <View style={styles.selectImageWrapper}>
            <Text style={[styles.textBlack, styles.textLabel]}>
              Hình ảnh game
            </Text>

            <TouchableOpacity
              onPress={handleSelectImageInGame}
              style={[styles.button]}>
              <Text style={[styles.textStyle]}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.textGray]}>
            Ấn vào hình ảnh để chuyển thành ảnh có quà
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
                  onPress={() => onImageInGamePress(item)}>
                  <Image
                    resizeMode="contain"
                    source={{uri: item.uri}}
                    style={styles.imageContainer}
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

        {/* number of pair */}
        <View>
          <Text style={[styles.textBlack, styles.textLabel]}>Số cặp </Text>
          <View style={[styles.mt_16, styles.gap_50]}>
            {listImage.map((image, i) => {
              if (image.selected) {
                return (
                  <View style={[styles.rowGift]} key={'Tỉ lệ' + image.uri}>
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

                    <View style={[styles.flex_1, styles.gap_10]}>
                      {[1, 2, 3].map(level => {
                        const label =
                          level === 1
                            ? 'Dễ'
                            : level === 2
                            ? 'Trung bình'
                            : 'Khó';
                        return (
                          <View key={'level' + level}>
                            <Text style={[styles.textBlack]}>{label}</Text>
                            <View style={[styles.flex_1]}>
                              <View style={styles.inputWrapper}>
                                <TextInput
                                  numberOfLines={1}
                                  value={
                                    image.pair
                                      ? image.pair[level - 1] || undefined
                                      : undefined
                                  }
                                  keyboardType="numeric"
                                  onChangeText={text =>
                                    onPairChange(text, image.uri, level)
                                  }
                                  placeholder="Nhập tỉ lệ"
                                  style={[
                                    styles.flex_1,
                                    styles.mh_16,
                                    styles.textBlack,
                                  ]}
                                />
                                <Text style={[styles.textBlack, styles.mr_16]}>
                                  Cặp
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              }
            })}

            {listImage.length <= 0 && !imageLose && (
              <Text style={styles.textGray}>(Trống)</Text>
            )}
          </View>
        </View>

        {/* image winner */}
        <View>
          <Text style={[styles.textBlack, styles.textLabel]}>
            Hình ảnh chiến thắng
          </Text>
          <View style={[styles.gap_6, styles.mt_16]}>
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
              <Text style={[styles.mv_6, styles.textGray]}>(Trống)</Text>
            )}
          </View>
        </View>

        {/* image lose */}
        <View style={styles.gap_16}>
          <View style={styles.selectImageWrapper}>
            <Text style={[styles.textBlack, styles.textLabel]}>
              Hình ảnh thua cuộc
            </Text>

            <TouchableOpacity
              onPress={handleLoseImagePress}
              style={[styles.button]}>
              <Text style={[styles.textStyle]}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>

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
        </View>

        {/* time to play */}
        <View style={[styles.gap_6, styles.mt_16]}>
          <Text style={[styles.textBlack, styles.textLabel]}>
            Thời gian hiển thị
          </Text>
        </View>

        <View>
          <View style={styles.timeSettingHeader}>
            <Text style={[styles.flex_1, styles.textGray]}>Màn</Text>
            <Text style={[styles.flex_1, styles.textGray]}>
              T.Gian chơi game (giây)
            </Text>
            <Text style={[styles.flex_1, styles.textGray]}>
              T.Gian hiển thị hình (giây)
            </Text>
          </View>
          {timeStore.map((item, index) => {
            return (
              <View key={item.key} style={styles.timeBodyContainer}>
                <Text style={[styles.textTimeLevel, styles.textGray]}>
                  {item.name}
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={item.timePlay}
                  onChangeText={text => onChangeTimePlay(text, index)}
                  style={[styles.flex_1, styles.textBlack]}
                />
                <TextInput
                  keyboardType="numeric"
                  onChangeText={text => onChangeTimeOff(text, index)}
                  value={item.timeOffImage}
                  style={[styles.flex_1, styles.textBlack]}
                />
              </View>
            );
          })}
        </View>

        {/* banner */}
        <View style={styles.gap_16}>
          <View style={styles.selectImageWrapper}>
            <Text style={[styles.textBlack, styles.textLabel]}>
              Hình ảnh Banner
            </Text>

            <TouchableOpacity
              onPress={handleBannerImagePress}
              style={[styles.button]}>
              <Text style={[styles.textStyle]}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>

          {bannerImage ? (
            <Image
              resizeMode="contain"
              style={styles.image}
              source={{
                uri: bannerImage,
              }}
            />
          ) : (
            <Text style={styles.textGray}>(Trống)</Text>
          )}
        </View>

        <TouchableOpacity onPress={onSubmitPress} style={[styles.button]}>
          <Text style={[styles.textStyle]}>Thay đổi</Text>
        </TouchableOpacity>
      </Pressable>
    </ScrollView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  textTimeLevel: {flex: 1, textAlignVertical: 'center'},
  mr_16: {marginRight: 16},
  mh_16: {marginHorizontal: 16},
  gap_10: {gap: 10},
  flex_1: {flex: 1},
  mv_6: {marginVertical: 6},
  mt_16: {
    marginTop: 16,
  },
  gap_6: {gap: 6},
  gap_16: {gap: 16},
  gap_50: {gap: 50},
  scrollView: {backgroundColor: 'white'},
  timeBodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  timeSettingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingBottom: 16,
    gap: 6,
  },
  textGray: {fontSize: 16, color: 'gray'},
  textLabel: {
    fontSize: 20,
  },
  giftEmpty: {
    borderColor: 'black',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftWrapper: {flex: 1, borderRadius: 6, borderWidth: 1},
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
    borderWidth: 1,
  },

  imageContainer: {width: '100%', height: '100%'},

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
