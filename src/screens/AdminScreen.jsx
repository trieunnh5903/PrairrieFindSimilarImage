import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
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
import ImagePicker from 'react-native-image-crop-picker';

const {width} = Dimensions.get('window');
const AdminScreen = ({navigation}) => {
  const foodStore = useSelector(state => state.food);
  // const [food, setFood] = useState(foodStore);
  const timeToPlay = useSelector(state => state.timeToPlay);
  const timeToDisplayImage = useSelector(state => state.timeToDisplayImage);
  const [timePlay, setTimePlay] = useState(timeToPlay);
  const [timeDisplay, setTimeDisplay] = useState(timeToDisplayImage);
  const [listImage, setListImage] = useState(foodStore);
  const dispatch = useDispatch();
  const onSubmitPress = () => {
    dispatch(changeTimeToDisplayImage(timeDisplay));
    dispatch(changeTimeToPlay(timePlay));
    dispatch(changeFood(listImage));
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

  // const toggleSwitch = (value, item) => {
  //   console.log(value);
  //   console.log(item);
  //   const newFood = food.map(food => {
  //     if (food.id === item.id) {
  //       return {...food, selected: value};
  //     } else {
  //       return food;
  //     }
  //   });
  //   setFood(newFood);
  // };

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

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
        <Text style={styles.textBlack}>Hình ảnh game</Text>

        <View style={styles.imageWrapper}>
          {listImage?.map(item => {
            return (
              <TouchableOpacity
                key={item.uri}
                activeOpacity={0.8}
                style={[styles.image]}
                onPress={() => onImagePress(item)}>
                <Image source={{uri: item.uri}} style={styles.image} />
                {item.selected && (
                  <Image
                    source={require('../asset/selected.png')}
                    style={styles.selected}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.textBlack}>
          Số ảnh chơi game: {listImage.length || 0}
        </Text>
        <Text style={styles.textBlack}>
          Số phần quà: {listImage.filter(i => i.selected === true).length || 0}
        </Text>

        <TouchableOpacity onPress={handleSelectImage} style={[styles.button]}>
          <Text style={[styles.textStyle]}>Chọn ảnh</Text>
        </TouchableOpacity>
        {/* <View style={{gap: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
          {food.map(i => {
            if (i.canChange) {
              return (
                <View style={{flexDirection: 'row'}} key={i.uri}>
                  <Image source={i.uri} style={styles.image} />
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
        </View> */}

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

        <TouchableOpacity onPress={onSubmitPress} style={[styles.button]}>
          <Text style={[styles.textStyle]}>Thay đổi</Text>
        </TouchableOpacity>
      </Pressable>
    </ScrollView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
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
  textBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

  textStyle: {
    color: 'white',
    textAlign: 'center',
  },

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
  },

  input: {
    color: 'black',
    textAlign: 'center',
  },
});
