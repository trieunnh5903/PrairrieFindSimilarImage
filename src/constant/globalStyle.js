import {StyleSheet} from 'react-native';

const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#7e9d38',
  },
  textButton: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  flex_1: {flex: 1},
  textGray: {fontSize: 16, color: 'gray'},
  textBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export {globalStyle};
