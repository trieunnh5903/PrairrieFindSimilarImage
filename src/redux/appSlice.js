import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  timeToPlay: 30,
  timeToDisplayImage: 0.5,
  selectedGame: '',
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
  },
});

// Action creators are generated for each case reducer function
export const {changeTimeToDisplayImage, changeTimeToPlay, selectGame} =
  appSlice.actions;

export default appSlice.reducer;
