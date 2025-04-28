import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  referralNotifications: []
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setReferralNotifications: (state, action) => {
      state.referralNotifications = action.payload;
    },
    addReferralNotification: (state, action) => {
      state.referralNotifications.unshift(action.payload);
    },
    clearReferralNotifications: (state) => {
      state.referralNotifications = [];
    }
  },
});

export const { 
  setReferralNotifications, 
  addReferralNotification,
  clearReferralNotifications
} = notificationsSlice.actions;

export default notificationsSlice.reducer; 