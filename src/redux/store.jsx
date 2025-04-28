import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./slices/listing.slice.jsx";
import userSlice from "./slices/user.slice.jsx";
import searchSlice from "./slices/search.slice.jsx";
import notificationsSlice from "./slices/notifications.slice.jsx";

export const store = configureStore({
  reducer: {
    listing: listingReducer,
    user: userSlice,
    search: searchSlice,
    notifications: notificationsSlice
  },
});
