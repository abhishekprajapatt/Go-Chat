import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  name: '',
  email: '',
  profilePic: '',
  token: '',
  onlineUsers: [],
  socketConnection: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id = '', name = '', email = '', profilePic = '' } = action.payload || {};
      state._id = _id;
      state.name = name;
      state.email = email;
      state.profilePic = profilePic;
    },
    updateUser: (state, action) => {
      const { name, profilePic } = action.payload || {};
      if (name) state.name = name;
      if (profilePic) state.profilePic = profilePic;
    },
    setToken: (state, action) => {
      state.token = action.payload || '';
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = Boolean(action.payload);
    },
    logout: () => initialState,
  },
});

export const { setUser, updateUser, setToken, setOnlineUsers, setSocketConnection, logout } = userSlice.actions;
export default userSlice.reducer;