import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const placeOrder = createAsyncThunk("orders/place", async (items) => {
  const res = await api.post("/api/orders", { items });
  return res.data;
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { list: [] },
  extraReducers: (b) => {
    b.addCase(placeOrder.fulfilled, (s, a) => {
      s.list.push(a.payload);
    });
  },
});

export default orderSlice.reducer;
