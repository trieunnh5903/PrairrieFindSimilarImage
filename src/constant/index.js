import {Dimensions} from 'react-native';
export const EMAIL = 'baocao9987@gmail.com';
const colors = {
  primary: '#7e9d38',
};

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export * from './customerKey';
export * from './globalStyle';
export * from './ScreenName';
export * from './storageKey';
export {colors};
