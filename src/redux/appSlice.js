import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  timeToPlay: 30,
  timeToDisplayImage: 1,
  selectedGame: '',
  level: 1,
  food: [
    // dưa
    {
      id: 1,
      uri: require('../asset/thom.webp'),
      selected: true,
      canChange: true,
    },
    // dâu
    {
      id: 2,
      selected: true,
      canChange: true,
      uri: require('../asset/dau.webp'),
    },
    // cam
    {
      id: 3,
      selected: true,
      canChange: true,
      uri: require('../asset/cam.webp'),
    },
    // chuoi
    {
      id: 4,
      selected: true,
      canChange: true,
      uri: require('../asset/chuoi.webp'),
    },
    // cherry
    {
      id: 5,
      selected: true,
      uri: require('../asset/cherry.webp'),
      canChange: false,
    },
    // //  dudu
    // {
    //   id: 11,
    //   selected: true,
    //   uri: require('../asset/dudu.webp'),
    //   canChange: false,
    // },
    // // cherry
    // {
    //   id: 35,
    //   selected: true,
    //   uri: require('../asset/cherry.webp'),
    //   canChange: false,
    // },
    // //  dudu
    // {
    //   id: 121,
    //   selected: true,
    //   uri: require('../asset/dudu.webp'),
    //   canChange: false,
    // },
  ],
};

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeTimeToPlay: (state, action) => {
      state.timeToPlay = action.payload;
    },

    changeTimeToDisplayImage: (state, action) => {
      state.timeToDisplayImage = action.payload;
    },

    selectGame: (state, action) => {
      state.selectedGame = action.payload;
    },

    changeFood: (state, action) => {
      state.food = action.payload;
    },

    changeLevel: (state, action) => {
      state.level = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeTimeToDisplayImage,
  changeTimeToPlay,
  selectGame,
  changeFood,
  changeLevel,
} = appSlice.actions;

export default appSlice.reducer;
