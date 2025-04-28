import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    accessToken:"",
    initialized:false

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser:(state,action)=>{
      const {token , user} = action.payload;
      state.user = user;
      state.accessToken = token;
      state.initialized = true;
    },
    logOut:(state)=>{
      state.user = null
      state.accessToken = null;
      state.initialized = true;
      localStorage.removeItem("user");
    },
    setInitialized(state) {
      state.initialized = true;
    },
  },
});

export const { setUser , logOut , setInitialized} = userSlice.actions;
export default userSlice.reducer;