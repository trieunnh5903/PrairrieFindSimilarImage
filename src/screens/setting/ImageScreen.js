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
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import ImagePicker from 'react-native-image-crop-picker';
import {
  changeLoseImage,
  changeTimeToPlay,
  changeTimeOffImage,
  addImages,
  updateImages,
  updatePair,
  changeBannerImage,
  setError,
} from '../../redux/appSlice';
import {CheckedSvg, DownSvg, icons} from '../../asset';
import {Padding, AppTextInput} from '../../components';
import {colors, globalStyle, screenHeight, screenWidth} from '../../constant';

const {width} = Dimensions.get('window');
const ImageScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const listImage = useSelector(state => state.imageInGame);
  const imageLose = useSelector(state => state.loseImage);

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

  const onChangeNameOfGift = (uri, text) => {
    const newListImage = listImage.map(item => {
      if (item.selected && item.uri === uri) {
        return {...item, name: text};
      } else {
        return item;
      }
    });

    dispatch(updateImages(newListImage));
  };

  const onPairChange = (text, imageUri, level) => {
    dispatch(updatePair({value: text, uri: imageUri, level}));
  };

  return (
    <ScrollView>
      <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
        {/* imgae in game */}
        <View style={[styles.gap_6, {paddingHorizontal: 16}]}>
          <View style={styles.selectImageWrapper}>
            <Text style={[styles.textBlack, styles.textLabel]}>
              Hình ảnh sẽ lật lên trong game
            </Text>

            <Text style={[globalStyle.textWhite]}>
              Ấn vào hình ảnh để chuyển thành ảnh có quà
            </Text>

            <TouchableOpacity
              onPress={handleSelectImageInGame}
              style={[styles.button]}>
              <Text style={[styles.textStyle]}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>
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
                    <CheckedSvg
                      width={32}
                      height={32}
                      style={styles.selected}
                      fill={'red'}
                    />
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={globalStyle.textWhite}>(Trống)</Text>
          )}
        </View>

        {/* image winner */}
        {listImage.filter(i => i.selected === true).length > 0 && (
          <>
            <Padding />
            <View style={{paddingHorizontal: 16}}>
              <Text style={[styles.textBlack, styles.textLabel]}>
                Hình ảnh phần quà
              </Text>
              <View style={[{gap: 20}, styles.mt_16]}>
                {listImage
                  .filter(i => i.selected === true)
                  .map((image, index) => {
                    if (image.selected) {
                      return (
                        <View
                          style={styles.giftContainer}
                          key={'qua' + image.uri}>
                          <Text style={globalStyle.textWhiteBold}>
                            Phần quà số {index + 1}
                          </Text>
                          <View style={{flex: 1, alignItems: 'center'}}>
                            <Text
                              style={[
                                globalStyle.textWhite,
                                globalStyle.mt_16,
                              ]}>
                              Hình ảnh trong game
                            </Text>
                            <View style={[styles.giftWrapper, {width: '40%'}]}>
                              <Image
                                resizeMode="contain"
                                source={{uri: image.uri}}
                                style={styles.gift}
                              />
                            </View>

                            <Image
                              resizeMode="contain"
                              style={styles.downArrow}
                              source={icons.right_arrow}
                              tintColor={'white'}
                            />

                            <Text style={globalStyle.textWhite}>
                              Hình ảnh phần quà
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleImageGift(image.uri)}
                              activeOpacity={0.8}
                              style={[styles.giftWrapper, {width: '40%'}]}>
                              {image.giftUri ? (
                                <Image
                                  resizeMode="contain"
                                  source={{uri: image.giftUri}}
                                  style={styles.gift}
                                />
                              ) : (
                                <View style={[styles.gift, styles.giftEmpty]}>
                                  <Text style={styles.textBlack}>Chọn ảnh</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>

                          <AppTextInput
                            style={styles.input}
                            value={image.name}
                            placeholder="Tên phần quà bằng chữ"
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                            onChangeText={text =>
                              onChangeNameOfGift(image.uri, text)
                            }
                          />
                        </View>
                      );
                    }
                  })}
              </View>
            </View>
            <Padding />
          </>
        )}

        {/* number of pair */}
        <View style={{paddingHorizontal: 16}}>
          {listImage.find(i => i.selected) && (
            <>
              <Text style={[styles.textBlack, styles.textLabel]}>
                Số cặp xuất hiện trong game
              </Text>
            </>
          )}
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
                      source={icons.right_arrow}
                      tintColor={'white'}
                    />

                    <View style={[styles.flex_1, styles.gap_10]}>
                      {[1, 2, 3].map(level => {
                        const label =
                          level === 1
                            ? 'Màn dễ'
                            : level === 2
                            ? 'Màn trung bình'
                            : 'Màn khó';
                        return (
                          <View key={'level' + level}>
                            <Text style={[globalStyle.textWhiteBold]}>
                              {label}
                            </Text>
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
                                    globalStyle.textWhiteBold,
                                  ]}
                                />
                                <Text
                                  style={[globalStyle.textWhite, styles.mr_16]}>
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

            {/* {listImage.length <= 0 && !imageLose && (
              <Text style={styles.textGray}>(Trống)</Text>
            )} */}
          </View>
        </View>
        <Padding />

        {/* image lose */}
        <View style={[styles.gap_16, {paddingHorizontal: 16}]}>
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
            <Text style={globalStyle.textWhite}>(Trống)</Text>
          )}
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  downArrow: {
    width: width * 0.1,
    height: width * 0.1,
    marginVertical: 16,
    transform: [{rotate: '90deg'}],
  },

  giftContainer: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
  },

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
    color: 'white',
  },
  giftEmpty: {
    // borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 4,
  },
  giftWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 6,
    marginTop: 6,
  },
  gift: {width: '100%', aspectRatio: 1, borderRadius: 6},
  rowGift: {
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selected: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  imageWrapper: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },

  image: {
    width: (width - 32) / 2 - 10,
    height: (width - 32) / 2 - 10,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'white',
  },

  imageContainer: {width: '100%', height: '100%'},

  selectedImage: {
    borderWidth: 1,
    borderColor: 'red',
  },

  textBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },

  selectImageWrapper: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'flex-start',
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'white',
  },

  buttonClose: {
    backgroundColor: '#2196F3',
    margin: 20,
  },

  container: {
    paddingVertical: 16,
    flex: 1,
    backgroundColor: colors.primary,
    gap: 16,
    minHeight: screenHeight,
  },

  inputWrapper: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
  },

  input: {
    borderColor: 'white',
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 1,
    marginVertical: 16,
    borderRadius: 6,
    paddingHorizontal: 16,
  },
});
