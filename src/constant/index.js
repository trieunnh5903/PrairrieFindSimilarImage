import {Dimensions} from 'react-native';

const colors = {
  primary: '#7e9d38',
};

export const screenWidth = Dimensions.get('window').width;

export * from './globalStyle';
export * from './ScreenName';
export * from './storageKey';
export {colors};
