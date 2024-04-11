import {StyleSheet} from 'react-native';

const globalStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
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
  textWhite: {
    color: 'white',
    fontSize: 16,
  },
  textWhiteBold: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mr_16: {marginRight: 16},
  mh_16: {marginHorizontal: 16},
  gap_10: {gap: 10},
  mv_6: {marginVertical: 6},
  mt_16: {
    marginTop: 16,
  },
  gap_6: {gap: 6},
  gap_16: {gap: 16},
  gap_50: {gap: 50},
});

export {globalStyle};
