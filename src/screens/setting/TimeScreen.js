import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {globalStyle} from '../../constant';
import {changeTimeOffImage, changeTimeToPlay} from '../../redux/appSlice';

const TimeScreen = () => {
  const dispatch = useDispatch();
  const timeStore = useSelector(state => state.time);
  const onChangeTimePlay = (value, index) => {
    dispatch(changeTimeToPlay({value, index}));
  };

  const onChangeTimeOff = (value, index) => {
    dispatch(changeTimeOffImage({value, index}));
  };

  return (
    <View style={[globalStyle.container, {justifyContent: 'center'}]}>
      <View style={styles.timeSettingHeader}>
        <Text style={[globalStyle.flex_1, globalStyle.textBlack]}>Màn</Text>
        <Text style={[globalStyle.flex_1, globalStyle.textBlack]}>
          T.Gian chơi game (giây)
        </Text>
        <Text style={[globalStyle.flex_1, globalStyle.textBlack]}>
          T.Gian hiển thị hình (giây)
        </Text>
      </View>
      {timeStore.map((item, index) => {
        return (
          <View key={item.key} style={styles.timeBodyContainer}>
            <Text style={[styles.textTimeLevel, globalStyle.textGray]}>
              {item.name}
            </Text>
            <TextInput
              keyboardType="numeric"
              value={item.timePlay}
              onChangeText={text => onChangeTimePlay(text, index)}
              style={[globalStyle.flex_1, globalStyle.textBlack]}
            />
            <TextInput
              keyboardType="numeric"
              onChangeText={text => onChangeTimeOff(text, index)}
              value={item.timeOffImage}
              style={[globalStyle.flex_1, globalStyle.textBlack]}
            />
          </View>
        );
      })}
    </View>
  );
};

export default TimeScreen;

const styles = StyleSheet.create({
  textTimeLevel: {flex: 1, textAlignVertical: 'center'},
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
});
