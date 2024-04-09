import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  error: true,
  level: 1,
  imageInGame: [],
  loseImage: '',
  banner: '',
  time: [
    {
      key: 1,
      name: 'Dễ',
      timeOffImage: '0.9',
      timePlay: '16',
    },
    {
      key: 2,
      name: 'Trung bình',
      timeOffImage: '0.9',
      timePlay: '24',
    },
    {
      key: 3,
      name: 'Khó',
      timeOffImage: '0.9',
      timePlay: '33',
    },
  ],
};

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },

    changeTimeToPlay: (state, action) => {
      const {value, index} = action.payload;
      state.time[index].timePlay = value;
    },

    changeTimeOffImage: (state, action) => {
      const {value, index} = action.payload;
      state.time[index].timeOffImage = value;
    },

    addImages: (state, action) => {
      state.imageInGame = action.payload;
    },

    updateImages: (state, action) => {
      state.imageInGame = action.payload;
    },

    updatePair: (state, action) => {
      const {value, uri, level} = action.payload;
      const newListImage = state.imageInGame.map(item => {
        if (item.uri === uri) {
          // let pair = item.pair || ['0', '0', '0'];
          // pair[level - 1] = text;
          let pair = item.pair || ['', '', ''];
          pair[level - 1] = value;
          return {...item, pair};
        } else {
          return item;
        }
      });
      state.imageInGame = newListImage;
    },

    changeLoseImage: (state, action) => {
      state.loseImage = action.payload;
    },

    changeBannerImage: (state, action) => {
      state.banner = action.payload;
    },

    changeLevel: (state, action) => {
      state.level = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setError,
  addImages,
  updateImages,
  changeTimeOffImage,
  changeTimeToPlay,
  changeLevel,
  changeLoseImage,
  updatePair,
  changeBannerImage,
} = appSlice.actions;

export default appSlice.reducer;
