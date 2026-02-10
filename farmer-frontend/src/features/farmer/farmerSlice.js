import { createSlice } from "@reduxjs/toolkit";

const farmerSlice = createSlice({
  name: "farmer",
  initialState: { products: [], orders: [] },
  reducers: {
    setFarmerProducts: (s, a) => {
      s.products = a.payload;
    },
    setFarmerOrders: (s, a) => {
      s.orders = a.payload;
    },
  },
});

export const { setFarmerProducts, setFarmerOrders } = farmerSlice.actions;
export default farmerSlice.reducer;
