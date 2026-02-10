import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await api.get("/api/products");
  return res.data;
});

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => {
      s.loading = true;
    }).addCase(fetchProducts.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
  },
});

export default productSlice.reducer;
