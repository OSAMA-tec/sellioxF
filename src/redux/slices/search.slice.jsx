import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "",
    category: "",
    subCategory: "",
    listingNumber: ""
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTitle: (state, action) => {
      const { title } = action.payload;
      state.title = title;
      // Clear listing number when specifically searching by title
      state.listingNumber = "";
    },
    setSearchCategory: (state, action) => {      
      state.category = action.payload;
    },
    setSearchSubCategory: (state, action) => {      
      state.category = action.payload.category || '';
      state.subCategory = action.payload.subCategory || '';
    },
    setSearchListingNumber: (state, action) => {
      const { listingNumber } = action.payload;
      state.listingNumber = listingNumber;
      // Clear title when specifically searching by listing number
      state.title = "";
    },
    clearSearch: (state) => {
      state.title = "";
      state.listingNumber = "";
    }
  },
});

export const { 
  setSearchTitle, 
  setSearchCategory, 
  setSearchSubCategory,
  setSearchListingNumber,
  clearSearch
} = searchSlice.actions;

export default searchSlice.reducer;