import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {globalStyle, screenWidth} from '../../constant';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {changeBannerImage, changeStandByBackground} from '../../redux/appSlice';
import {AppButton} from '../../components';

const StandByImage = () => {
  const dispatch = useDispatch();
  const bannerImage = useSelector(state => state.banner);
  const standByBackground = useSelector(state => state.standByBackground);
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

  const handleBgImagePress = async () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(result => {
        dispatch(changeStandByBackground(result.path));
      })
      .catch(() => {});
  };
  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.gap_16, {paddingHorizontal: 16}]}>
        <View style={styles.selectImageWrapper}>
          <View style={[globalStyle.gap_16]}>
            <Text style={[globalStyle.textWhiteBold, styles.textLabel]}>
              Banner quảng cáo
            </Text>
            {bannerImage ? (
              <Image
                resizeMode="contain"
                style={styles.image}
                source={{
                  uri: bannerImage,
                }}
              />
            ) : (
              <Text style={globalStyle.textWhite}>(Trống)</Text>
            )}
            <AppButton label="Chọn ảnh" onPress={handleBannerImagePress} />
          </View>

          <View style={[globalStyle.gap_16, globalStyle.mt_16]}>
            <Text style={[globalStyle.textWhiteBold, styles.textLabel]}>
              Ảnh nền
            </Text>
            {standByBackground ? (
              <Image
                resizeMode="contain"
                style={styles.image}
                source={{
                  uri: standByBackground,
                }}
              />
            ) : (
              <Text style={globalStyle.textWhite}>(Trống)</Text>
            )}
            <AppButton label="Chọn ảnh" onPress={handleBgImagePress} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default StandByImage;

const styles = StyleSheet.create({
  selectImageWrapper: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'flex-start',
  },
  textLabel: {
    fontSize: 20,
    color: 'white',
  },
  image: {
    width: (screenWidth - 32) / 2 - 10,
    height: (screenWidth - 32) / 2 - 10,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'white',
  },
});
