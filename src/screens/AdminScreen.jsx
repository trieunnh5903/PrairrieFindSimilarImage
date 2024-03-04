import {
  Alert,
  BackHandler,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeFood,
  changeTimeToDisplayImage,
  changeTimeToPlay,
} from '../redux/appSlice';

const AdminScreen = ({navigation}) => {
  const foodStore = useSelector(state => state.food);
  const [food, setFood] = useState(foodStore);
  const {width} = useWindowDimensions();
  const timeToPlay = useSelector(state => state.timeToPlay);
  const timeToDisplayImage = useSelector(state => state.timeToDisplayImage);
  const [timePlay, setTimePlay] = useState(timeToPlay);
  const [timeDisplay, setTimeDisplay] = useState(timeToDisplayImage);
  const dispatch = useDispatch();
  const onSubmitPress = () => {
    dispatch(changeTimeToDisplayImage(timeDisplay));
    dispatch(changeTimeToPlay(timePlay));
    dispatch(changeFood(food));
    Alert.alert('Thông báo', 'Thay đổi thành công');
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

  const toggleSwitch = (value, item) => {
    console.log(value);
    console.log(item);
    const newFood = food.map(food => {
      if (food.id === item.id) {
        return {...food, selected: value};
      } else {
        return food;
      }
    });
    setFood(newFood);
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
        <View style={{gap: 6}}>
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
        </View>

        <View style={{gap: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
          {food.map(i => {
            if (i.canChange) {
              return (
                <View style={{flexDirection: 'row'}} key={i.uri}>
                  <Image
                    source={i.uri}
                    style={{
                      width: width * 0.3,
                      height: width * 0.3,
                      borderRadius: 6,
                    }}
                  />
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={i.selected ? '#81b0ff' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={value => toggleSwitch(value, i)}
                    value={i.selected}
                  />
                </View>
              );
            }
          })}
        </View>
        <TouchableOpacity
          onPress={onSubmitPress}
          style={[styles.button, styles.buttonClose]}>
          <Text style={[styles.textStyle]}>Thay đổi</Text>
        </TouchableOpacity>
      </Pressable>
    </ScrollView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  textBlack: {
    color: 'black',
  },

  textStyle: {
    color: 'white',
    textAlign: 'center',
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  },

  input: {
    color: 'black',
    textAlign: 'center',
  },
});
