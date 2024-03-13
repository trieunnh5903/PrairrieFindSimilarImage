import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  timeToPlay: 30,
  timeToDisplayImage: 1,
  selectedGame: '',
  level: 1,
  food: [],
  loseImage: '',
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

    changeLoseImage: (state, action) => {
      state.loseImage = action.payload;
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
  changeLoseImage,
} = appSlice.actions;

export default appSlice.reducer;
