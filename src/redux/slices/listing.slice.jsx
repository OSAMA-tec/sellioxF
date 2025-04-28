import { createSlice } from "@reduxjs/toolkit";

const listing = {
  businessCard: {
    logo:null,
    businessTitle:"",
    businessInfo:"",
    location:"Australia",
    businessWebsite:"",
    services:[],
    filled:false
  },
  serviceCard:{
    serviceImages:[],
    serviceTitle:"",
    serviceDescription:"",
    servicePlan:"basic"
  }
};

const listingSlice = createSlice({
  name: "listing",
  initialState:listing,
  reducers: {
    setBusinessCard: (state, action) => {
      const {logo,businessTitle,location,businessInfo,businessWebsite ,services} = action.payload;
      state.businessCard.logo = logo;
      state.businessCard.businessTitle = businessTitle;
      state.businessCard.location = location;
      state.businessCard.businessInfo = businessInfo;
      state.businessCard.businessWebsite = businessWebsite;
      state.businessCard.services = services;
      state.businessCard.filled = true;
    },
    setService: (state,action) => {
      const {serviceImages,serviceTitle,serviceDescription,servicePlan} = action.payload;
      state.serviceCard.serviceImages = serviceImages;
      state.serviceCard.serviceTitle = serviceTitle;
      state.serviceCard.serviceDescription = serviceDescription;
      state.serviceCard.servicePlan = servicePlan;
    },
  },
});

export const { setBusinessCard, setService } = listingSlice.actions;
export default listingSlice.reducer;