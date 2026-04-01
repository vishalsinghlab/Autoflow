import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn:false,
  username: null,
  email: null,
  role: null,
  selectedUser: null,
  usersList: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { email, username, role,isLoggedIn } = action.payload;
      state.email = email;
      state.role = role;
      state.username = username;
      state.isLoggedIn=isLoggedIn;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload
    },
    clearUser: (state) => {
      state.email = null;
      state.role = null;
      state.username = null;
      state.isLoggedIn=false;
    }
  }
});

export const { setUser, clearUser, setSelectedUser, setUsersList } = userSlice.actions;
export default userSlice.reducer;
